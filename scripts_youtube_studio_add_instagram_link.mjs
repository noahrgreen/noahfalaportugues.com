import fs from 'fs';
import { chromium } from 'playwright';

const envPath = '/Users/noahgreen/NGO/secrets/website_secrets.env';
const raw = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
const kv = [];
for (const line of raw) {
  const s = line.trim();
  if (!s || s.startsWith('#') || !s.includes('=')) continue;
  const i = s.indexOf('=');
  const k = s.slice(0, i).trim();
  const v = s.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  kv.push([k, v]);
}

let email = '';
let pass = '';
const googleUserEntries = kv.filter(([k]) => k === 'GOOGLE_NFP_USERNAME').map(([, v]) => v);
if (googleUserEntries.length >= 2) {
  email = googleUserEntries[0];
  pass = googleUserEntries[1];
}
if (!email || !pass) throw new Error('Google credentials not found in expected format.');

const ig = kv.find(([k]) => k === 'IG_NFP_PROFILE')?.[1] || 'https://www.instagram.com/noahfalaportugues/';
const igUrl = ig.startsWith('http') ? ig : `https://www.instagram.com/${ig.replace(/^@/, '').replace(/\/$/, '')}/`;

const channelId = 'UCzc5B0ZvHzP1AZlYZu6_CSg';
const target = `https://studio.youtube.com/channel/${channelId}/editing/details`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

let status = 'unknown';
try {
  await page.goto(target, { waitUntil: 'domcontentloaded' });
  if (page.url().includes('accounts.google.com')) {
    await page.fill('input[type="email"]', email);
    await page.click('#identifierNext');
    await page.waitForTimeout(1800);
    await page.fill('input[type="password"]', pass);
    await page.click('#passwordNext');
    await page.waitForTimeout(6000);
  }

  await page.goto(target, { waitUntil: 'networkidle' });

  const addLink = page.getByRole('button', { name: /add link|add/i }).first();
  if (await addLink.count()) {
    await addLink.click();
    const textboxes = page.locator('input[type="text"]');
    const count = await textboxes.count();
    if (count >= 2) {
      await textboxes.nth(count - 2).fill('Instagram');
      await textboxes.nth(count - 1).fill(igUrl);
      const saveBtn = page.getByRole('button', { name: /publish|save/i }).first();
      if (await saveBtn.count()) {
        await saveBtn.click();
        status = 'attempted_save';
      } else {
        status = 'link_fields_filled_no_save_button';
      }
    } else {
      status = 'add_link_clicked_but_fields_not_found';
    }
  } else {
    status = 'add_link_button_not_found';
  }
} catch (e) {
  status = `error:${String(e).slice(0, 220)}`;
}

await page.screenshot({ path: '/Users/noahgreen/NGO/noahfalaportugues.com/docs/screenshots/youtube-studio-links-attempt.png', fullPage: true });
console.log('status:', status);
await browser.close();
