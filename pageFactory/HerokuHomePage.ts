import { testConfig } from '@/testConfig';
import { BrowserContext, Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for The Internet Herokuapp Home Page
 * Provides actions and assertions for the main page
 */
export class HerokuHomePage {
    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly pageHeader: Locator;
    readonly pageSubtitle: Locator;
    readonly abTestingLink: Locator;
    readonly addRemoveElementsLink: Locator;
    readonly basicAuthLink: Locator;
    readonly checkboxesLink: Locator;
    readonly dropdownLink: Locator;
    readonly fileUploadLink: Locator;
    readonly formAuthenticationLink: Locator;
    readonly hoversLink: Locator;
    readonly jsAlertsLink: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

        // Initialize locators
        this.pageHeader = page.locator('h1');
        this.pageSubtitle = page.locator('h2');
        this.abTestingLink = page.getByRole('link', { name: 'A/B Testing' });
        this.addRemoveElementsLink = page.getByRole('link', { name: 'Add/Remove Elements' });
        this.basicAuthLink = page.getByRole('link', { name: 'Basic Auth' });
        this.checkboxesLink = page.getByRole('link', { name: 'Checkboxes' });
        this.dropdownLink = page.getByRole('link', { name: 'Dropdown' });
        this.fileUploadLink = page.getByRole('link', { name: 'File Upload' });
        this.formAuthenticationLink = page.getByRole('link', { name: 'Form Authentication' });
        this.hoversLink = page.getByRole('link', { name: 'Hovers' });
        this.jsAlertsLink = page.getByRole('link', { name: 'JavaScript Alerts' });
    }

    // Actions
    async goto(): Promise<void> {
        await this.page.goto(testConfig.internet);
    }

    async clickABTesting(): Promise<void> {
        await this.abTestingLink.click();
    }

    async clickAddRemoveElements(): Promise<void> {
        await this.addRemoveElementsLink.click();
    }

    async clickBasicAuth(): Promise<void> {
        await this.basicAuthLink.click();
    }

    async clickCheckboxes(): Promise<void> {
        await this.checkboxesLink.click();
    }

    async clickDropdown(): Promise<void> {
        await this.dropdownLink.click();
    }

    async clickFileUpload(): Promise<void> {
        await this.fileUploadLink.click();
    }

    async clickFormAuthentication(): Promise<void> {
        await this.formAuthenticationLink.click();
    }

    async clickHovers(): Promise<void> {
        await this.hoversLink.click();
    }

    async clickJavaScriptAlerts(): Promise<void> {
        await this.jsAlertsLink.click();
    }

    // Assertions
    async expectHeaderToBeVisible(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
    }

    async expectHeaderText(text: string): Promise<void> {
        await expect(this.pageHeader).toHaveText(text);
    }

    async expectSubtitleToBeVisible(): Promise<void> {
        await expect(this.pageSubtitle).toBeVisible();
    }

    async expectLinkToBeVisible(linkName: string): Promise<void> {
        const link = this.page.getByRole('link', { name: linkName });
        await expect(link).toBeVisible();
    }

    async expectPageURL(): Promise<void> {
        await expect(this.page).toHaveURL(testConfig.internet + '/');
    }
}