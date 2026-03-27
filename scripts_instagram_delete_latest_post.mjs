import fs from 'fs';
import { chromium } from 'playwright';

const envPath = '/Users/noahgreen/NGO/secrets/website_secrets.env';
const shotPath = '/Users/noahgreen/NGO/noahfalaportugues.com/docs/screenshots/instagram-delete-latest-post.png';

const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
const env = {};
for (const line of lines) {
  const s = line.trim();
  if (!s || s.startsWith('#') || !s.includes('=')) continue;
  const i = s.indexOf('=');
  env[s.slice(0, i).trim()] = s.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
}

const username = env.IG_NFP_USERNAME || '';
const password = env.IG_NFP_PWD || '';
if (!username || !password) throw new Error('Missing Instagram credentials in env');

const browser = await chromium.launch({ headless: false, slowMo: 100 });
const context = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
const page = await context.newPage();

let status = 'unknown';
let deletedPath = null;

try {
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.fill('input[name="email"], input[name="username"]', username);
  await page.fill('input[name="pass"], input[name="password"]', password);
  await page.getByRole('button', { name: /log in/i }).first().click();
  await page.waitForTimeout(7000);

  for (let i = 0; i < 3; i += 1) {
    const notNow = page.getByRole('button', { name: /not now/i });
    if (await notNow.count()) {
      await notNow.first().click().catch(() => {});
      await page.waitForTimeout(1200);
    }
  }

  await page.goto('https://www.instagram.com/noahfalaportugues/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3500);

  const firstPostLink = page.locator('a[href*="/p/"]').first();
  if (!(await firstPostLink.count())) {
    status = 'no_posts_found';
  } else {
    deletedPath = await firstPostLink.getAttribute('href');
    await firstPostLink.click();
    await page.waitForTimeout(2200);

    const moreButtons = [
      page.getByRole('button', { name: /more options/i }).first(),
      page.locator('svg[aria-label="More options"]').first(),
      page.locator('button:has(svg[aria-label="More options"])').first(),
      page.locator('div[role="button"]:has(svg[aria-label="More options"])').first(),
    ];

    let openedMenu = false;
    for (const mb of moreButtons) {
      if (await mb.count()) {
        await mb.click().catch(() => {});
        await page.waitForTimeout(900);
        if (await page.getByText(/^Delete$/i).count()) {
          openedMenu = true;
          break;
        }
      }
    }

    if (!openedMenu) {
      status = 'more_options_not_found';
    } else {
      const deleteBtn = page.getByText(/^Delete$/i).first();
      if (!(await deleteBtn.count())) {
        status = 'delete_option_not_found';
      } else {
        await deleteBtn.click();
        await page.waitForTimeout(900);

        const confirmDelete = page.getByRole('button', { name: /^Delete$/i }).first();
        if (!(await confirmDelete.count())) {
          status = 'delete_confirm_not_found';
        } else {
          await confirmDelete.click();
          await page.waitForTimeout(5000);

          const undoText = page.getByText(/post deleted|undo/i).first();
          if (await undoText.count()) {
            status = 'deleted_successfully';
          } else {
            // fallback: close modal and check first post changed
            await page.goto('https://www.instagram.com/noahfalaportugues/', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(3000);
            const newFirst = await page.locator('a[href*="/p/"]').first().getAttribute('href').catch(() => null);
            status = newFirst && deletedPath && newFirst !== deletedPath ? 'deleted_successfully' : 'delete_clicked_status_uncertain';
          }
        }
      }
    }
  }
} catch (e) {
  status = `error:${String(e).slice(0, 220)}`;
}

await page.screenshot({ path: shotPath, fullPage: true }).catch(() => {});
console.log('status:', status);
if (deletedPath) console.log('target_post_path:', deletedPath);
await browser.close();
