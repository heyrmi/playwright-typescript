import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { testConfig } from '@/testConfig';

/**
 * Page Object for File Upload Page
 * Demonstrates file upload functionality
 */
export class FileUploadPage {
    private readonly fileUploadEndpoint: string = '/upload';

    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly pageHeader: Locator;
    readonly fileInput: Locator;
    readonly uploadButton: Locator;
    readonly uploadedFilesHeading: Locator;
    readonly uploadedFileName: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

        this.pageHeader = page.locator('h3');
        this.fileInput = page.locator('#file-upload');
        this.uploadButton = page.locator('#file-submit');
        this.uploadedFilesHeading = page.locator('h3');
        this.uploadedFileName = page.locator('#uploaded-files');
    }

    // Actions
    async goto(): Promise<void> {
        await this.page.goto(testConfig.internet + this.fileUploadEndpoint);
    }

    async uploadFile(filePath: string): Promise<void> {
        await this.fileInput.setInputFiles(filePath);
        await this.uploadButton.click();
    }

    async uploadMultipleFiles(filePaths: string[]): Promise<void> {
        await this.fileInput.setInputFiles(filePaths);
        await this.uploadButton.click();
    }

    async getUploadedFileName(): Promise<string | null> {
        return await this.uploadedFileName.textContent();
    }

    // Assertions
    async expectPageHeaderToBeVisible(): Promise<void> {
        await expect(this.pageHeader).toBeVisible();
    }

    async expectFileInputToBeVisible(): Promise<void> {
        await expect(this.fileInput).toBeVisible();
    }

    async expectUploadSuccess(fileName: string): Promise<void> {
        await expect(this.uploadedFilesHeading).toContainText('File Uploaded!');
        await expect(this.uploadedFileName).toContainText(fileName);
    }

    async expectUploadButtonToBeEnabled(): Promise<void> {
        await expect(this.uploadButton).toBeEnabled();
    }
}

