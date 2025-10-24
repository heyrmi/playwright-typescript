import {BrowserContext, Locator, Page} from '@playwright/test';

export class BasicAuthPage {
    // URL
    private readonly basicAuthUrl: string = 'https://admin:admin@the-internet.herokuapp.com';
    private readonly basicAuthEndPoint: string = '/basic_auth';

    // Page and context
    readonly page: Page;
    readonly context: BrowserContext;

    // Locators
    readonly headerHeading: Locator;

    // Constructor
    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.headerHeading = page.locator('h3');

    }

    async navigateToURL() {
        await this.page.goto(this.basicAuthUrl + this.basicAuthEndPoint);
    }
}