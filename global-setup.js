const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

module.exports = async () => {
  const authDir = path.resolve(__dirname, '.auth');
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
  const authFile = path.join(authDir, 'customer01.json');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForSelector('text=Products', { timeout: 5000 });
    await context.storageState({ path: authFile });
    console.log('Saved storage state to', authFile);
  } catch (err) {
    console.error('global-setup failed:', err);
    throw err;
  } finally {
    await browser.close();
  }
};
