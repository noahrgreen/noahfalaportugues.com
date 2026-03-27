import { chromium, devices } from 'playwright';

const base = 'http://127.0.0.1:4173';
const out = '/Users/noahgreen/NGO/noahfalaportugues.com/docs/screenshots';

async function shotDesktop(theme, name) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1512, height: 982 }, colorScheme: theme });
  const page = await context.newPage();
  await page.addInitScript((mode) => localStorage.setItem('nfp-theme', mode), theme);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/${name}`, fullPage: true });
  await browser.close();
}

async function shotMobile(theme, name) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 13'], colorScheme: theme });
  const page = await context.newPage();
  await page.addInitScript((mode) => localStorage.setItem('nfp-theme', mode), theme);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/${name}`, fullPage: true });
  await browser.close();
}

await shotDesktop('light', 'home-desktop-light.png');
await shotDesktop('dark', 'home-desktop-dark.png');
await shotMobile('light', 'home-mobile-light.png');
await shotMobile('dark', 'home-mobile-dark.png');
