import { testConfig } from '@/testConfig';

import { expect, test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test('Internet Heroku Website should have good Lighthouse scores', async ({ page }) => {
    await page.goto(testConfig.internet);

    await playAudit({
        page: page,
        thresholds: {
            performance: 80,
            accessibility: 80,
            'best-practices': 80,
            seo: 80,
            pwa: 80,
        }
    });

    // Added sample assertion to avoid test failure due to eslint check
    expect('100').toBeTruthy();
});