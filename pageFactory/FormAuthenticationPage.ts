import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { testConfig } from '@/testConfig';

/**
 * Page Object for Form Authentication Page
 * Demonstrates form-based authentication flow
 */
export class FormAuthenticationPage {
    private readonly formAuthEndpoint: string = '/login';
    private readonly secureAreaEndpoint: string = '/secure';

    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly pageHeader: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly flashMessage: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

        this.pageHeader = page.locator('h2');
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
        this.flashMessage = page.locator('#flash');
        this.logoutButton = page.locator('.button.secondary');
    }

    // Actions
    async goto(): Promise<void> {
        await this.page.goto(testConfig.internet + this.formAuthEndpoint);
    }

    async fillUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }

    async login(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    async logout(): Promise<void> {
        await this.logoutButton.click();
    }

    // Assertions
    async expectLoginPageVisible(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.pageHeader).toContainText('Login Page');
    }

    async expectLoginSuccess(): Promise<void> {
        await expect(this.flashMessage).toBeVisible();
        await expect(this.flashMessage).toContainText('You logged into a secure area!');
        await expect(this.page).toHaveURL(new RegExp(this.secureAreaEndpoint));
    }

    async expectLoginFailure(): Promise<void> {
        await expect(this.flashMessage).toBeVisible();
        await expect(this.flashMessage).toContainText('Your username is invalid!');
    }

    async expectLogoutSuccess(): Promise<void> {
        await expect(this.flashMessage).toBeVisible();
        await expect(this.flashMessage).toContainText('You logged out of the secure area!');
    }

    async expectSecureAreaVisible(): Promise<void> {
        await expect(this.pageHeader).toContainText('Secure Area');
        await expect(this.logoutButton).toBeVisible();
    }
}

