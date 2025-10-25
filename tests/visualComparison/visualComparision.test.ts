import test from '@lib/BaseTest';
import { expect } from '@playwright/test';

/**
 * Visual Comparison Tests
 * Tests visual regression using snapshot testing
 */
test.describe('Visual Regression Tests', () => {
    test('should match homepage screenshot', async ({ page, herokuHomePage }) => {
        await herokuHomePage.goto();
        await herokuHomePage.expectHeaderToBeVisible();

        expect(await page.screenshot()).toMatchSnapshot('homepage.png');
    });

    test('should match login page screenshot', async ({ page, formAuthenticationPage }) => {
        await formAuthenticationPage.goto();
        await formAuthenticationPage.expectLoginPageVisible();

        expect(await page.screenshot()).toMatchSnapshot('login-page.png');
    });

    test('should match dropdown page screenshot', async ({ page, dropdownPage }) => {
        await dropdownPage.goto();
        await dropdownPage.expectPageHeaderToBeVisible();

        expect(await page.screenshot()).toMatchSnapshot('dropdown-page.png');
    });
});