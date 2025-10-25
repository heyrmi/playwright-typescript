import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { testConfig } from '@/testConfig';

/**
 * Page Object for Checkboxes Page
 * Demonstrates handling checkbox elements
 */
export class CheckboxesPage {
    private readonly checkboxesEndpoint: string = '/checkboxes';

    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly pageHeader: Locator;
    readonly checkboxForm: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

        this.pageHeader = page.locator('h3');
        this.checkboxForm = page.locator('#checkboxes');
    }

    // Actions
    async goto(): Promise<void> {
        await this.page.goto(testConfig.internet + this.checkboxesEndpoint);
    }

    async checkCheckbox(index: number): Promise<void> {
        const checkbox = this.page.locator('#checkboxes input[type="checkbox"]').nth(index - 1);
        await checkbox.check();
    }

    async uncheckCheckbox(index: number): Promise<void> {
        const checkbox = this.page.locator('#checkboxes input[type="checkbox"]').nth(index - 1);
        await checkbox.uncheck();
    }

    async toggleCheckbox(index: number): Promise<void> {
        const checkbox = this.page.locator('#checkboxes input[type="checkbox"]').nth(index - 1);
        const isChecked = await checkbox.isChecked();

        if (isChecked) {
            await checkbox.uncheck();
        } else {
            await checkbox.check();
        }
    }

    async isCheckboxChecked(index: number): Promise<boolean> {
        const checkbox = this.page.locator('#checkboxes input[type="checkbox"]').nth(index - 1);
        return await checkbox.isChecked();
    }

    // Assertions
    async expectPageHeaderToBeVisible(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.pageHeader).toHaveText('Checkboxes');
    }

    async expectCheckboxToBeChecked(index: number): Promise<void> {
        const checkbox = this.page.locator('#checkboxes input[type="checkbox"]').nth(index - 1);
        await expect(checkbox).toBeChecked();
    }

    async expectCheckboxToBeUnchecked(index: number): Promise<void> {
        const checkbox = this.page.locator('#checkboxes input[type="checkbox"]').nth(index - 1);
        await expect(checkbox).not.toBeChecked();
    }

    async expectCheckboxCount(count: number): Promise<void> {
        const checkboxes = this.page.locator('#checkboxes input[type="checkbox"]');
        await expect(checkboxes).toHaveCount(count);
    }
}

