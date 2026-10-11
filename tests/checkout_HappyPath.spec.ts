import {test, expect} from '@playwright/test';

test.describe('Purchase swag', () => {
    test('Complete backpack checkout', async ({page}) => {
        await page.goto('/inventory.html');

        await test.step('Add backpack to cart', async () => {
            await expect(page.getByText('Products')).toBeVisible();
            const backpack = page.locator('.inventory_item').filter({hasText: 'Sauce Labs Backpack'});
            await backpack.getByRole('button', {name: 'Add to cart'}).click();
            await page.getByTestId('shopping-cart-link').click();
            await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
            await expect(page.locator('.cart_item').filter({hasText: 'Sauce Labs Backpack'})).toContainText('29.99');
        });

        await test.step('Enter customer information', async () => {
            await page.getByRole('button', {name: 'Checkout'}).click();
            await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
            await expect(page.getByText('Checkout: Your Information')).toBeVisible();
            await page.getByRole('textbox', {name: 'First Name'}).fill('John');
            await page.getByRole('textbox', {name: 'Last Name'}).fill('Doe');
            await page.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('12345');
            await page.getByRole('button', {name: 'Continue'}).click();
        });

        await test.step('Review and complete checkout', async () => {
            await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
            await expect(page.getByText('Checkout: Overview')).toBeVisible();
            await expect(page.locator('.cart_item').filter({hasText: 'Sauce Labs Backpack'})).toContainText('29.99');
            await page.getByRole('button', {name: 'Finish'}).click();
            await expect(page.getByText('Thank you for your order!')).toBeVisible();
        });
    });
});