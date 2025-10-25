import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { testConfig } from '@/testConfig';

/**
 * Page Object for Basic Authentication Page
 * Demonstrates handling HTTP Basic Authentication
 */
export class BasicAuthPage {
    private readonly basicAuthEndpoint: string = '/basic_auth';

    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly pageHeader: Locator;
    readonly successMessage: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.pageHeader = page.locator('h3');
        this.successMessage = page.locator('.example p');
    }

    // Actions
    async goto(): Promise<void> {
        // Method 1: Using credentials in URL
        const authUrl = `https://${testConfig.username}:${testConfig.password}@the-internet.herokuapp.com${this.basicAuthEndpoint}`;
        await this.page.goto(authUrl);
    }

    async gotoWithContext(): Promise<void> {
        // Method 2: Using browser context (more secure)
        await this.context.setHTTPCredentials({
            username: testConfig.username,
            password: testConfig.password,
        });
        await this.page.goto(testConfig.internet + this.basicAuthEndpoint);
    }

    // Assertions
    async expectPageHeaderToBeVisible(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
    }

    async expectPageHeaderText(text: string): Promise<void> {
        await expect(this.pageHeader).toHaveText(text);
    }

    async expectSuccessMessage(): Promise<void> {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toContainText('Congratulations');
    }

    async expectAuthenticationSuccess(): Promise<void> {
        await this.expectPageHeaderToBeVisible();
        await this.expectPageHeaderText('Basic Auth');
        await this.expectSuccessMessage();
    }
}