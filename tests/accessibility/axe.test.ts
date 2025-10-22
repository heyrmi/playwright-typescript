import test from '@lib/BaseTest';
import {expect} from '@playwright/test';
import {testConfig} from '@/testConfig';

test('Verify Page Accessibility', async ({page, makeAxeBuilder}) => {
    await page.goto(testConfig.internet);
    const accessibilityScanResults = await makeAxeBuilder.analyze();

    // uses the AxeBuilder configuration
    expect(accessibilityScanResults.violations).toEqual([]);
});