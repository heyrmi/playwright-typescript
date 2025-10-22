import fs from 'fs';
import {APIResponse, expect} from '@playwright/test';

export class ApiActions {

    async verifyStatusCode(response: APIResponse): Promise<void> {
        await expect(response, 'API did not return 200 response code').toBeOK();
    }

    async verifyResponseHeader(responsePart: Array<{
        name: string,
        value: string
    }>, expectedResponseHeaderParams: string, responseType: string): Promise<void> {
        let status = true;
        let fieldNames = 'Parameter';
        for (const responseKey of responsePart) {
            if (!(expectedResponseHeaderParams.includes(responseKey.name.trim()))) {
                status = false;
                fieldNames = fieldNames + ', ' + responseKey.name;
                break;
            }
        }
        expect(status, `Response header does not contain ${fieldNames} for ${responseType}`).toBe(true);
    }

    async verifyResponseBody(responsePart: JSON, expectedResponseBodyParams: string, responseType: string): Promise<void> {
        let status = true;
        let fieldNames = 'Parameter';
        const headers = expectedResponseBodyParams.split('|');
        const responseToString = JSON.stringify(responsePart).trim();

        for (const header of headers) {
            if (!(responseToString.includes(header.trim()))) {
                status = false;
                fieldNames = fieldNames + ', ' + header;
                break;
            }
        }
        expect(status, `Response body does not contain ${fieldNames} for ${responseType}`).toBe(true);
    }


    // TODO: See if this can be moved to a common utility class
    async readValuesFromTextFile(filepath: string, filename: string): Promise<string> {
        return fs.readFileSync(filepath + filename, 'utf8');
    }

    // TODO: Add more methods as needed to make comprehensive API actions
}