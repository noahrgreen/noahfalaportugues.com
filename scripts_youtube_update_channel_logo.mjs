import fs from 'fs';
import { chromium } from 'playwright';

const envPath = '/Users/noahgreen/NGO/secrets/website_secrets.env';
const imagePath = '/Users/noahgreen/NGO/noahfalaportugues.com/public/images/noah-logo.png';
const channelId = 'UCzc5B0ZvHzP1AZlYZu6_CSg';
const target = `https://studio.youtube.com/channel/${channelId}/customization/branding`;

if (!fs.existsSync(imagePath)) {
  throw new Error('Logo image file missing.');
}

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

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

let status = 'unknown';
try {
  await page.goto(target, { waitUntil: 'domcontentloaded' });

  if (page.url().includes('accounts.google.com')) {
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count()) {
      await emailInput.first().fill(email);
      await page.click('#identifierNext');
      await page.waitForTimeout(2200);
    }

    const passInput = page.locator('input[type="password"]');
    if (await passInput.count()) {
      await passInput.first().fill(pass);
      await page.click('#passwordNext');
      await page.waitForTimeout(7000);
    }
  }

  await page.goto(target, { waitUntil: 'networkidle' });

  if (page.url().includes('accounts.google.com')) {
    status = 'blocked_google_auth_challenge';
  } else {
    const fileInputs = page.locator('input[type="file"]');
    const count = await fileInputs.count();

    if (count === 0) {
      status = 'no_file_input_found_on_branding_page';
    } else {
      await fileInputs.first().setInputFiles(imagePath);
      await page.waitForTimeout(2500);

      const done = page.getByRole('button', { name: /done/i }).first();
      if (await done.count()) {
        await done.click();
        await page.waitForTimeout(900);
      }

      const publish = page.getByRole('button', { name: /publish/i }).first();
      if (await publish.count()) {
        await publish.click();
        await page.waitForTimeout(2500);
        status = 'uploaded_and_publish_clicked';
      } else {
        status = 'uploaded_no_publish_button_found';
      }
    }
  }
} catch (e) {
  status = `error:${String(e).slice(0, 220)}`;
}

await page.screenshot({ path: '/Users/noahgreen/NGO/noahfalaportugues.com/docs/screenshots/youtube-channel-logo-update-attempt.png', fullPage: true });
console.log('status:', status);
await browser.close();
