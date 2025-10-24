import test from '@lib/BaseTest';
import { expect } from '@playwright/test';

test('Visual Comparison', async ({ page, herokuHomePage }): Promise<void> => {
    await herokuHomePage.navigateToURL();
    expect(await page.screenshot()).toMatchSnapshot('login-page.png');
});