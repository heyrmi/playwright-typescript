import {BrowserContext, Page} from '@playwright/test';
import CryptoJS from 'crypto-js';
import {testConfig} from '@/testConfig';
import fs from 'fs';
import {Workbook} from 'exceljs';

export class WebActions {
    readonly page: Page;
    readonly context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }

    async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async clickWithExactText(text: string): Promise<void> {
        await this.page.getByText(text, {exact: true}).click();
    }

    async clickElementWithJS(locator: string): Promise<void> {
        // Note: This uses browser native apis to click on the element
        await this.page.$eval(locator, (element: HTMLElement) => element.click());
    }


    // TODO: Can add below methods to another file? Or move to a common utility class?
    async encryptPassword(): Promise<string> {
        const key = '1234567890';
        return CryptoJS.AES.encrypt('someRandomPassword', key).toString();
    }

    async decryptPassword(): Promise<string> {
        const key = '1234567890';
        return CryptoJS.AES.decrypt(testConfig.password, key).toString(CryptoJS.enc.Utf8);
    }

    async readDataFromExcel(
        filepath: string,
        fileName: string,
        sheetName: string,
        rowNum: number,
        cellNum: number
    ): Promise<string> {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filepath + fileName);

        const sheet = workbook.getWorksheet(sheetName);

        if (!sheet) throw new Error(`Sheet "${sheetName}" not found in ${fileName}`);

        return sheet.getRow(rowNum).getCell(cellNum).toString();
    }

    async readValuesFromTextFile(filePath: string) {
        return fs.readFileSync(filePath, 'utf8');
    }

    // TODO: Add more methods as needed to make comprehensive web actions
}
