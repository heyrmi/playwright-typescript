import { BrowserContext, Locator, Page } from '@playwright/test';
import { testConfig } from '@/testConfig';

/**
 * WebActions class provides reusable browser interaction methods
 * This class should only contain browser/page interaction methods
 * For file operations, use FileUtils
 * For encryption, use CryptoUtils
 */
export class WebActions {
    readonly page: Page;
    readonly context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }

    /**
     * Navigate to a URL
     * @param url - URL to navigate to (can be relative if baseURL is set)
     */
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Click element by exact text match
     * @param text - Exact text to match
     */
    async clickWithExactText(text: string): Promise<void> {
        await this.page.getByText(text, { exact: true }).click();
    }

    /**
     * Click element using JavaScript (useful for hidden or covered elements)
     * @param locator - CSS selector
     */
    async clickElementWithJS(locator: string): Promise<void> {
        await this.page.$eval(locator, (element: HTMLElement) => element.click());
    }

    /**
     * Click element by role and name
     * @param role - ARIA role
     * @param name - Accessible name
     */
    async clickByRole(role: 'button' | 'link' | 'textbox' | 'checkbox', name: string): Promise<void> {
        await this.page.getByRole(role, { name }).click();
    }

    /**
     * Fill input field by label
     * @param label - Label text
     * @param value - Value to fill
     */
    async fillByLabel(label: string, value: string): Promise<void> {
        await this.page.getByLabel(label).fill(value);
    }

    /**
     * Wait for element to be visible
     * @param locator - Locator or CSS selector
     * @param timeout - Timeout in milliseconds (defaults to testConfig.waitForElement)
     */
    async waitForElement(locator: string | Locator, timeout?: number): Promise<void> {
        const timeoutValue = timeout || testConfig.waitForElement;

        if (typeof locator === 'string') {
            await this.page.waitForSelector(locator, { timeout: timeoutValue, state: 'visible' });
        } else {
            await locator.waitFor({ timeout: timeoutValue, state: 'visible' });
        }
    }

    /**
     * Wait for page to load completely (networkidle)
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Scroll element into view
     * @param locator - CSS selector
     */
    async scrollIntoView(locator: string): Promise<void> {
        await this.page.$eval(locator, (element: HTMLElement) => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    /**
     * Get text content of an element
     * @param locator - CSS selector or Locator
     * @returns Text content
     */
    async getTextContent(locator: string | Locator): Promise<string> {
        if (typeof locator === 'string') {
            const text = await this.page.locator(locator).textContent();
            return text || '';
        } else {
            const text = await locator.textContent();
            return text || '';
        }
    }

    /**
     * Check if element is visible
     * @param locator - CSS selector or Locator
     * @returns true if visible, false otherwise
     */
    async isVisible(locator: string | Locator): Promise<boolean> {
        try {
            if (typeof locator === 'string') {
                return await this.page.locator(locator).isVisible();
            } else {
                return await locator.isVisible();
            }
        } catch {
            return false;
        }
    }

    /**
     * Handle alert/confirm/prompt dialogs
     * @param action - 'accept' or 'dismiss'
     * @param promptText - Text to enter in prompt (optional)
     */
    async handleDialog(action: 'accept' | 'dismiss', promptText?: string): Promise<void> {
        this.page.on('dialog', async (dialog) => {
            if (promptText) {
                await dialog.accept(promptText);
            } else if (action === 'accept') {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        });
    }

    /**
     * Upload file(s)
     * @param locator - File input selector
     * @param filePaths - Array of file paths or single file path
     */
    async uploadFile(locator: string, filePaths: string | string[]): Promise<void> {
        const fileInput = this.page.locator(locator);
        await fileInput.setInputFiles(Array.isArray(filePaths) ? filePaths : [filePaths]);
    }

    /**
     * Download file and return path
     * @param downloadTrigger - Function that triggers the download
     * @returns Downloaded file path
     */
    async downloadFile(downloadTrigger: () => Promise<void>): Promise<string> {
        const downloadPromise = this.page.waitForEvent('download');
        await downloadTrigger();
        const download = await downloadPromise;
        const path = await download.path();
        return path || '';
    }

    /**
     * Get frame locator by name, URL, or selector
     * @param frameLocator - Frame name, URL, or selector
     * @returns Frame locator
     */
    getFrameLocator(frameLocator: string) {
        return this.page.frameLocator(frameLocator);
    }

    /**
     * Take screenshot of element or page
     * @param locator - Optional locator for element screenshot
     * @returns Screenshot buffer
     */
    async takeScreenshot(locator?: string): Promise<Buffer> {
        if (locator) {
            return await this.page.locator(locator).screenshot();
        }
        return await this.page.screenshot();
    }

    /**
     * Delay/wait for specified milliseconds
     * @param ms - Milliseconds to wait
     */
    async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get current page URL
     * @returns Current URL
     */
    async getCurrentURL(): Promise<string> {
        return this.page.url();
    }

    /**
     * Get page title
     * @returns Page title
     */
    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Hover over an element
     * @param locator - CSS selector or Locator
     */
    async hover(locator: string | Locator): Promise<void> {
        if (typeof locator === 'string') {
            await this.page.locator(locator).hover();
        } else {
            await locator.hover();
        }
    }

    /**
     * Double click an element
     * @param locator - CSS selector or Locator
     */
    async doubleClick(locator: string | Locator): Promise<void> {
        if (typeof locator === 'string') {
            await this.page.locator(locator).dblclick();
        } else {
            await locator.dblclick();
        }
    }

    /**
     * Right click an element
     * @param locator - CSS selector or Locator
     */
    async rightClick(locator: string | Locator): Promise<void> {
        if (typeof locator === 'string') {
            await this.page.locator(locator).click({ button: 'right' });
        } else {
            await locator.click({ button: 'right' });
        }
    }
}
