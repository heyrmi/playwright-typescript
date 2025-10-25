import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * API Actions class provides reusable API testing methods
 * Includes common verifications and helper methods for API testing
 */
export class ApiActions {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * Verify response status code is 200-299 (OK)
     * @param response - API Response object
     */
    async verifyStatusCode(response: APIResponse, expectedStatus?: number): Promise<void> {
        if (expectedStatus) {
            expect(response.status(), `Expected status ${expectedStatus} but got ${response.status()}`).toBe(expectedStatus);
        } else {
            await expect(response, 'API did not return 200-299 response code').toBeOK();
        }
    }

    /**
     * Verify specific response headers exist
     * @param response - API Response object
     * @param expectedHeaders - Array of expected header names or object with name-value pairs
     */
    async verifyResponseHeaders(
        response: APIResponse,
        expectedHeaders: string[] | Record<string, string>
    ): Promise<void> {
        const headers = response.headers();

        if (Array.isArray(expectedHeaders)) {
            for (const headerName of expectedHeaders) {
                expect(headers, `Response missing header: ${headerName}`).toHaveProperty(headerName.toLowerCase());
            }
        } else {
            for (const [name, value] of Object.entries(expectedHeaders)) {
                expect(headers[name.toLowerCase()], `Header ${name} has unexpected value`).toBe(value);
            }
        }
    }

    /**
     * Verify response body contains expected fields
     * @param response - API Response object
     * @param expectedFields - Array of field names or paths (e.g., 'data.id')
     */
    async verifyResponseBodyFields(response: APIResponse, expectedFields: string[]): Promise<void> {
        const body = await response.json();

        for (const field of expectedFields) {
            const fieldPath = field.split('.');
            let current = body;

            for (const key of fieldPath) {
                expect(current, `Field path '${field}' not found in response`).toHaveProperty(key);
                current = current[key];
            }
        }
    }

    /**
     * Verify response body matches expected structure
     * @param response - API Response object
     * @param expectedBody - Expected body object or partial match
     */
    async verifyResponseBody(response: APIResponse, expectedBody: Record<string, any>): Promise<void> {
        const actualBody = await response.json();

        for (const [key, value] of Object.entries(expectedBody)) {
            expect(actualBody, `Response body missing key: ${key}`).toHaveProperty(key);
            expect(actualBody[key], `Value mismatch for key: ${key}`).toEqual(value);
        }
    }

    /**
     * Verify response body contains text/substring
     * @param response - API Response object
     * @param expectedText - Text that should be in response
     */
    async verifyResponseContains(response: APIResponse, expectedText: string): Promise<void> {
        const body = await response.text();
        expect(body, `Response does not contain: ${expectedText}`).toContain(expectedText);
    }

    /**
     * Get response body as JSON
     * @param response - API Response object
     * @returns Parsed JSON response
     */
    async getResponseJson<T>(response: APIResponse): Promise<T> {
        return await response.json() as T;
    }

    /**
     * Get response body as text
     * @param response - API Response object
     * @returns Response text
     */
    async getResponseText(response: APIResponse): Promise<string> {
        return await response.text();
    }

    /**
     * Verify response time is within threshold
     * @param startTime - Request start time (Date.now())
     * @param maxMs - Maximum allowed milliseconds
     */
    verifyResponseTime(startTime: number, maxMs: number): void {
        const duration = Date.now() - startTime;
        expect(duration, `Response time ${duration}ms exceeded threshold ${maxMs}ms`).toBeLessThan(maxMs);
    }

    /**
     * Verify array length in response
     * @param response - API Response object
     * @param arrayPath - Path to array in response (e.g., 'data.users')
     * @param expectedLength - Expected array length (or min/max object)
     */
    async verifyArrayLength(
        response: APIResponse,
        arrayPath: string,
        expectedLength: number | { min?: number; max?: number }
    ): Promise<void> {
        const body = await response.json();
        const pathParts = arrayPath.split('.');
        let current = body;

        for (const key of pathParts) {
            current = current[key];
        }

        expect(Array.isArray(current), `${arrayPath} is not an array`).toBe(true);

        if (typeof expectedLength === 'number') {
            expect(current.length, `Array length mismatch at ${arrayPath}`).toBe(expectedLength);
        } else {
            if (expectedLength.min !== undefined) {
                expect(current.length, `Array length below minimum at ${arrayPath}`).toBeGreaterThanOrEqual(expectedLength.min);
            }
            if (expectedLength.max !== undefined) {
                expect(current.length, `Array length above maximum at ${arrayPath}`).toBeLessThanOrEqual(expectedLength.max);
            }
        }
    }

    /**
     * Make GET request with common options
     * @param url - Request URL
     * @param options - Request options (headers, params, etc.)
     * @returns API Response
     */
    async get(url: string, options?: { headers?: Record<string, string>; params?: Record<string, string> }): Promise<APIResponse> {
        return await this.request.get(url, options);
    }

    /**
     * Make POST request with common options
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options (headers, etc.)
     * @returns API Response
     */
    async post(url: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
        return await this.request.post(url, { data, ...options });
    }

    /**
     * Make PUT request with common options
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options (headers, etc.)
     * @returns API Response
     */
    async put(url: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
        return await this.request.put(url, { data, ...options });
    }

    /**
     * Make PATCH request with common options
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options (headers, etc.)
     * @returns API Response
     */
    async patch(url: string, data?: any, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
        return await this.request.patch(url, { data, ...options });
    }

    /**
     * Make DELETE request with common options
     * @param url - Request URL
     * @param options - Request options (headers, etc.)
     * @returns API Response
     */
    async delete(url: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
        return await this.request.delete(url, options);
    }
}