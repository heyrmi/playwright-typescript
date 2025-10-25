import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { testConfig } from '@/testConfig';

/**
 * Page Object for JavaScript Alerts Page
 * Demonstrates handling JavaScript alerts, confirms, and prompts
 */
export class JavaScriptAlertsPage {
    private readonly jsAlertsEndpoint: string = '/javascript_alerts';

    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly pageHeader: Locator;
    readonly jsAlertButton: Locator;
    readonly jsConfirmButton: Locator;
    readonly jsPromptButton: Locator;
    readonly resultText: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

        this.pageHeader = page.locator('h3');
        this.jsAlertButton = page.locator('button:has-text("Click for JS Alert")');
        this.jsConfirmButton = page.locator('button:has-text("Click for JS Confirm")');
        this.jsPromptButton = page.locator('button:has-text("Click for JS Prompt")');
        this.resultText = page.locator('#result');
    }

    // Actions
    async goto(): Promise<void> {
        await this.page.goto(testConfig.internet + this.jsAlertsEndpoint);
    }

    async clickJSAlert(): Promise<void> {
        await this.jsAlertButton.click();
    }

    async clickJSConfirm(): Promise<void> {
        await this.jsConfirmButton.click();
    }

    async clickJSPrompt(): Promise<void> {
        await this.jsPromptButton.click();
    }

    async handleAlert(action: 'accept' | 'dismiss'): Promise<string> {
        return new Promise((resolve) => {
            this.page.once('dialog', async (dialog) => {
                const message = dialog.message();
                if (action === 'accept') {
                    await dialog.accept();
                } else {
                    await dialog.dismiss();
                }
                resolve(message);
            });
        });
    }

    async handlePrompt(action: 'accept' | 'dismiss', promptText?: string): Promise<string> {
        return new Promise((resolve) => {
            this.page.once('dialog', async (dialog) => {
                const message = dialog.message();
                if (action === 'accept' && promptText) {
                    await dialog.accept(promptText);
                } else if (action === 'accept') {
                    await dialog.accept();
                } else {
                    await dialog.dismiss();
                }
                resolve(message);
            });
        });
    }

    async getResultText(): Promise<string | null> {
        return await this.resultText.textContent();
    }

    // Assertions
    async expectPageHeaderToBeVisible(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
        await expect(this.pageHeader).toHaveText('JavaScript Alerts');
    }

    async expectResultText(expectedText: string): Promise<void> {
        await expect(this.resultText).toContainText(expectedText);
    }

    async expectAllButtonsVisible(): Promise<void> {
        await expect(this.jsAlertButton).toBeVisible();
        await expect(this.jsConfirmButton).toBeVisible();
        await expect(this.jsPromptButton).toBeVisible();
    }
}

