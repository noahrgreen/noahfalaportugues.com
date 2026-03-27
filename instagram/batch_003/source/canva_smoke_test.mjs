import fs from 'fs';
import { chromium } from 'playwright';

const envPath = '/Users/noahgreen/NGO/secrets/website_secrets.env';
const shot = '/Users/noahgreen/NGO/noahfalaportugues.com/instagram/batch_003/review/CANVA_SMOKE_TEST.png';

const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
const env = {};
for (const line of lines) {
  const s = line.trim();
  if (!s || s.startsWith('#') || !s.includes('=')) continue;
  const i = s.indexOf('=');
  env[s.slice(0, i).trim()] = s.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
}

const canvaUrl = env.CANVA_URL?.startsWith('http') ? env.CANVA_URL : `https://${env.CANVA_URL || 'canva.com'}`;
const username = env.CANVA_USERNAME || '';
const password = env.CANVA_PWD || '';

const browser = await chromium.launch({ headless: false, slowMo: 80 });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
let status = 'unknown';

try {
  await page.goto(canvaUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2000);

  const loginCandidates = [
    page.getByRole('link', { name: /log in|login/i }).first(),
    page.getByRole('button', { name: /log in|login/i }).first(),
    page.locator('a:has-text("Log in"), button:has-text("Log in")').first(),
  ];

  for (const c of loginCandidates) {
    if (await c.count()) {
      await c.click().catch(() => {});
      await page.waitForTimeout(1200);
      break;
    }
  }

  if (username && password) {
    const emailInput = page.locator('input[type="email"], input[name*="email" i], input[autocomplete*="email" i]').first();
    if (await emailInput.count()) {
      await emailInput.fill(username);
      const continueBtn = page.getByRole('button', { name: /continue|next|log in/i }).first();
      if (await continueBtn.count()) {
        await continueBtn.click().catch(() => {});
        await page.waitForTimeout(1000);
      }
    }

    const passInput = page.locator('input[type="password"], input[name*="password" i]').first();
    if (await passInput.count()) {
      await passInput.fill(password);
      const submit = page.getByRole('button', { name: /log in|continue|sign in/i }).first();
      if (await submit.count()) {
        await submit.click().catch(() => {});
      }
      await page.waitForTimeout(5000);
    }
  }

  const current = page.url();
  if (/challenge|verify|captcha|checkpoint/i.test(current)) {
    status = 'login_challenge';
  } else if (/canva.com\/(design|home|folders|projects)/i.test(current)) {
    status = 'login_success_or_home';
  } else {
    status = 'partial_or_unknown';
  }
} catch (e) {
  status = `error:${String(e).slice(0, 220)}`;
}

await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
console.log('status:', status);
await browser.close();
