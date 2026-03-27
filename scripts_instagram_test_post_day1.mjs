import fs from 'fs';
import { chromium } from 'playwright';

const envPath = '/Users/noahgreen/NGO/secrets/website_secrets.env';
const imagePath = '/Users/noahgreen/NGO/noahfalaportugues.com/assets/instagram/5day-batch/IG_Post_01.png';
const shotPath = '/Users/noahgreen/NGO/noahfalaportugues.com/docs/screenshots/instagram-test-post-day1.png';

const caption = `A common mistake I still hear (and used to make) in Brazilian Portuguese:\n\n"Eu sou 30 anos."\n\nNatural correction:\n"Eu tenho 30 anos."\n\nIn Portuguese, age is expressed with TER, not SER.\nSmall correction, big difference in sounding natural.\n\nFollow for real Brazilian Portuguese as I learn it in practice.\n\n#BrazilianPortuguese #LearnPortuguese #PortugueseLanguage #LanguageLearning #PortugueseForBeginners #EnglishSpeakers #RealPortuguese #LearnInPublic`;

if (!fs.existsSync(imagePath)) throw new Error('Day 1 image not found');

const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
const env = new Map();
for (const line of lines) {
  const s = line.trim();
  if (!s || s.startsWith('#') || !s.includes('=')) continue;
  const i = s.indexOf('=');
  const k = s.slice(0, i).trim();
  const v = s.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  env.set(k, v);
}

const username = env.get('IG_NFP_USERNAME') || '';
const password = env.get('IG_NFP_PWD') || '';
if (!username || !password) throw new Error('Missing Instagram credentials in env.');

const browser = await chromium.launch({ headless: false, slowMo: 120 });
const context = await browser.newContext({ viewport: { width: 1440, height: 2000 } });
const page = await context.newPage();

let status = 'unknown';

try {
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2000);

  const userInput = page.locator('input[name="username"], input[name="email"]');
  const passInput = page.locator('input[name="password"], input[name="pass"]');

  if (!(await userInput.count()) || !(await passInput.count())) {
    status = 'login_form_not_found';
  } else {
    await userInput.fill(username);
    await passInput.fill(password);
    await page.getByRole('button', { name: /log in/i }).first().click();
    await page.waitForTimeout(7000);

    const current = page.url();
    if (/challenge|two_factor|checkpoint/i.test(current)) {
      status = 'blocked_challenge_or_2fa';
    } else {
      for (let i = 0; i < 3; i += 1) {
        const notNowButtons = page.getByRole('button', { name: /not now/i });
        if (await notNowButtons.count()) {
          await notNowButtons.first().click().catch(() => {});
          await page.waitForTimeout(1300);
        }
      }

      const createCandidates = [
        page.locator('a:has-text("New post")').first(),
        page.getByRole('link', { name: /create/i }).first(),
        page.getByRole('button', { name: /create/i }).first(),
      ];

      let createClicked = false;
      for (const c of createCandidates) {
        if (await c.count()) {
          await c.click().catch(() => {});
          await page.waitForTimeout(1400);
          createClicked = true;
          break;
        }
      }
      if (!createClicked) {
        status = 'create_button_not_found';
      }

      const fileInput = page.locator('input[type="file"]').first();
      if (status !== 'create_button_not_found' && !(await fileInput.count())) {
        status = 'file_input_not_found_after_create';
      } else if (status !== 'create_button_not_found') {
        await fileInput.setInputFiles(imagePath);
        await page.waitForTimeout(3000);

        const nextBtn = page.getByRole('button', { name: /^Next$/i });
        if (await nextBtn.count()) {
          await nextBtn.first().click();
          await page.waitForTimeout(1200);
        }
        if (await nextBtn.count()) {
          await nextBtn.first().click();
          await page.waitForTimeout(1200);
        }

        const captionBox = page.locator('textarea[aria-label*="caption" i], div[aria-label*="caption" i][contenteditable="true"]').first();
        if (!(await captionBox.count())) {
          status = 'caption_box_not_found';
        } else {
          await captionBox.click();
          await captionBox.fill(caption);
          await page.waitForTimeout(700);

          const shareBtn = page.getByRole('button', { name: /^Share$/i }).first();
          if (!(await shareBtn.count())) {
            status = 'share_button_not_found';
          } else {
            await shareBtn.click();
            await page.waitForTimeout(9000);

            const sharedText = page.getByText(/Your post has been shared|Post shared/i).first();
            if (await sharedText.count()) {
              status = 'posted_successfully';
            } else {
              // Fallback check: redirected to profile/feed without composer modal
              status = 'share_clicked_status_uncertain';
            }
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
await browser.close();
