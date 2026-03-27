import { chromium } from 'playwright';

const imagePath = '/Users/noahgreen/NGO/noahfalaportugues.com/public/images/noah-logo.png';
const channelId = 'UCzc5B0ZvHzP1AZlYZu6_CSg';
const target = `https://studio.youtube.com/channel/${channelId}/customization/branding`;
const userDataDir = '/tmp/chrome-nfp-playwright';

const context = await chromium.launchPersistentContext(userDataDir, {
  headless: true,
  args: ['--profile-directory=Profile 35'],
});

const page = context.pages()[0] ?? await context.newPage();
let status = 'unknown';

try {
  await page.goto(target, { waitUntil: 'networkidle', timeout: 90000 });

  if (page.url().includes('accounts.google.com')) {
    status = 'profile_copy_not_authenticated';
  } else {
    const fileInputs = page.locator('input[type="file"]');
    const count = await fileInputs.count();

    if (count === 0) {
      status = 'no_file_input_found';
    } else {
      await fileInputs.first().setInputFiles(imagePath);
      await page.waitForTimeout(2500);

      const done = page.getByRole('button', { name: /done/i }).first();
      if (await done.count()) {
        await done.click();
        await page.waitForTimeout(1000);
      }

      const publish = page.getByRole('button', { name: /publish/i }).first();
      if (await publish.count()) {
        await publish.click();
        await page.waitForTimeout(3000);
        status = 'uploaded_and_publish_clicked';
      } else {
        status = 'uploaded_no_publish_button';
      }
    }
  }
} catch (e) {
  status = `error:${String(e).slice(0, 240)}`;
}

await page.screenshot({ path: '/Users/noahgreen/NGO/noahfalaportugues.com/docs/screenshots/youtube-channel-logo-update-temp-profile-attempt.png', fullPage: true });
console.log('status:', status);
await context.close();
