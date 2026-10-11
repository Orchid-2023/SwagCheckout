import {test as setup, expect} from '@playwright/test';

const authFile = ".auth/customer01.json";

setup('Authenticate', async ({page, context}) => {
     await page.goto('https://www.saucedemo.com');
     await page.getByRole('textbox', {name: 'Username'}).fill('standard_user');
     await page.getByRole('textbox', {name: 'Password'}).fill('secret_sauce');
     await page.getByRole('button', {name: 'Login'}).click();

     await page.waitForURL('https://www.saucedemo.com/inventory.html');
     await expect(page.getByText('Products')).toBeVisible();
     await page.context().storageState({path: authFile});
});