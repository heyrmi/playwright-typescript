import test from '@lib/BaseTest';
import {expect} from '@playwright/test';

test('Visual Comparison', async ({page, loginPage}): Promise<void> => {
    await loginPage.naviageteToLoginPage();
    expect(await page.screenshot()).toMatchSnapshot('login-page.png');
});