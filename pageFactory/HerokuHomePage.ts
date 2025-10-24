import {testConfig} from '@/testConfig';
import {BrowserContext, Locator, Page} from '@playwright/test';

export class HerokuHomePage {
    // Page and context
    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly pageHeader: Locator;

    // Constructor
    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.pageHeader = page.locator('h1');
    }

    async navigateToURL(): Promise<void> {
        await this.page.goto(testConfig.internet);
    }
}