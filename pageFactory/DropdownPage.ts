import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { testConfig } from '@/testConfig';

/**
 * Page Object for Dropdown Page
 * Demonstrates handling dropdown/select elements
 */
export class DropdownPage {
    private readonly dropdownEndpoint: string = '/dropdown';

    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly pageHeader: Locator;
    readonly dropdownList: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

        this.pageHeader = page.locator('h3');
        this.dropdownList = page.locator('#dropdown');
    }

    // Actions
    async goto(): Promise<void> {
        await this.page.goto(testConfig.internet + this.dropdownEndpoint);
    }

    async selectOptionByValue(value: string): Promise<void> {
        await this.dropdownList.selectOption({ value });
    }

    async selectOptionByLabel(label: string): Promise<void> {
        await this.dropdownList.selectOption({ label });
    }

    async selectOptionByIndex(index: number): Promise<void> {
        await this.dropdownList.selectOption({ index });
    }

    async getSelectedOption(): Promise<string | null> {
        return await this.dropdownList.inputValue();
    }

    // Assertions
    async expectPageHeaderToBeVisible(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.pageHeader).toHaveText('Dropdown List');
    }

    async expectDropdownToBeVisible(): Promise<void> {
        await expect(this.dropdownList).toBeVisible();
    }

    async expectSelectedOption(expectedValue: string): Promise<void> {
        await expect(this.dropdownList).toHaveValue(expectedValue);
    }

    async expectDropdownHasOptions(expectedOptions: string[]): Promise<void> {
        for (const option of expectedOptions) {
            const optionElement = this.page.locator(`#dropdown option:has-text("${option}")`);
            await expect(optionElement).toBeAttached();
        }
    }
}

