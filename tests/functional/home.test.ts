import test from '@lib/BaseTest';
import { expect } from '@playwright/test';

/**
 * Functional Tests for Herokuapp Home Page
 * Tests navigation and page structure
 */
test.describe('Herokuapp Home Page', () => {
    test.beforeEach(async ({ herokuHomePage }) => {
        await herokuHomePage.goto();
    });

    test('should display homepage correctly', async ({ herokuHomePage }) => {
        await herokuHomePage.expectHeaderToBeVisible();
        await herokuHomePage.expectHeaderText('Welcome to the-internet');
        await herokuHomePage.expectSubtitleToBeVisible();
    });

    test('should have all navigation links visible', async ({ herokuHomePage }) => {
        await herokuHomePage.expectLinkToBeVisible('A/B Testing');
        await herokuHomePage.expectLinkToBeVisible('Basic Auth');
        await herokuHomePage.expectLinkToBeVisible('Checkboxes');
        await herokuHomePage.expectLinkToBeVisible('Dropdown');
        await herokuHomePage.expectLinkToBeVisible('File Upload');
    });

    test('should navigate to A/B Testing page', async ({ herokuHomePage, page }) => {
        await herokuHomePage.clickABTesting();
        await expect(page).toHaveURL(/.*abtest/);
        await expect(page.locator('h3')).toBeVisible();
    });

    test('should navigate to Add/Remove Elements page', async ({ herokuHomePage, page }) => {
        await herokuHomePage.clickAddRemoveElements();
        await expect(page).toHaveURL(/.*add_remove_elements/);
    });

    test('should navigate to Checkboxes page', async ({ herokuHomePage, page }) => {
        await herokuHomePage.clickCheckboxes();
        await expect(page).toHaveURL(/.*checkboxes/);
    });

    test('should navigate to Dropdown page', async ({ herokuHomePage, page }) => {
        await herokuHomePage.clickDropdown();
        await expect(page).toHaveURL(/.*dropdown/);
    });

    test('should verify page title', async ({ page }) => {
        const title = await page.title();
        expect(title).toContain('The Internet');
    });
});

