import { test, expect } from '@playwright/test';

/**
 * API Tests for ReqRes Resources Endpoints
 * Tests resource listing and retrieval
 */
test.describe('ReqRes API - Resources', () => {
    test.describe('GET /api/unknown', () => {
        test('should get list of resources', async ({ request }) => {
            const response = await request.get('/api/unknown');

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body).toHaveProperty('page');
            expect(body).toHaveProperty('per_page');
            expect(body).toHaveProperty('total');
            expect(body).toHaveProperty('total_pages');
            expect(body).toHaveProperty('data');
            expect(Array.isArray(body.data)).toBe(true);
        });

        test('should verify resource object structure', async ({ request }) => {
            const response = await request.get('/api/unknown');
            const body = await response.json();

            expect(body.data.length).toBeGreaterThan(0);

            const resource = body.data[0];
            expect(resource).toHaveProperty('id');
            expect(resource).toHaveProperty('name');
            expect(resource).toHaveProperty('year');
            expect(resource).toHaveProperty('color');
            expect(resource).toHaveProperty('pantone_value');

            // Verify Pantone color format
            expect(resource.color).toMatch(/^#[0-9A-F]{6}$/i);
        });

        test('should get single resource by ID', async ({ request }) => {
            const resourceId = 2;
            const response = await request.get(`/api/unknown/${resourceId}`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.data).toHaveProperty('id', resourceId);
            expect(body.data).toHaveProperty('name');
            expect(body.data).toHaveProperty('year');
            expect(body.data).toHaveProperty('color');
        });

        test('should return 404 for non-existent resource', async ({ request }) => {
            const response = await request.get('/api/unknown/999');
            expect(response.status()).toBe(404);
        });

        test('should paginate resources correctly', async ({ request }) => {
            const page1Response = await request.get('/api/unknown?page=1');
            const page2Response = await request.get('/api/unknown?page=2');

            const page1Body = await page1Response.json();
            const page2Body = await page2Response.json();

            expect(page1Body.page).toBe(1);
            expect(page2Body.page).toBe(2);

            // Ensure different data on different pages
            if (page1Body.data.length > 0 && page2Body.data.length > 0) {
                expect(page1Body.data[0].id).not.toBe(page2Body.data[0].id);
            }
        });
    });

    test.describe('Resource Data Validation', () => {
        test('should have valid Pantone values', async ({ request }) => {
            const response = await request.get('/api/unknown');
            const body = await response.json();

            for (const resource of body.data) {
                // Pantone value should be in format like "15-4020"
                expect(resource.pantone_value).toMatch(/^\d{2}-\d{4}$/);
            }
        });

        test('should have valid year values', async ({ request }) => {
            const response = await request.get('/api/unknown');
            const body = await response.json();

            for (const resource of body.data) {
                expect(resource.year).toBeGreaterThan(1900);
                expect(resource.year).toBeLessThanOrEqual(new Date().getFullYear());
            }
        });

        test('should have valid hex color codes', async ({ request }) => {
            const response = await request.get('/api/unknown');
            const body = await response.json();

            const hexColorRegex = /^#[0-9A-F]{6}$/i;

            for (const resource of body.data) {
                expect(resource.color).toMatch(hexColorRegex);
            }
        });
    });

    test.describe('Pagination Tests', () => {
        test('should respect per_page parameter', async ({ request }) => {
            const perPage = 3;
            const response = await request.get(`/api/unknown?per_page=${perPage}`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.per_page).toBe(perPage);
            expect(body.data.length).toBeLessThanOrEqual(perPage);
        });

        test('should calculate total_pages correctly', async ({ request }) => {
            const response = await request.get('/api/unknown');
            const body = await response.json();

            const expectedTotalPages = Math.ceil(body.total / body.per_page);
            expect(body.total_pages).toBe(expectedTotalPages);
        });

        test('should handle last page correctly', async ({ request }) => {
            // First, get total pages
            const firstResponse = await request.get('/api/unknown');
            const firstBody = await firstResponse.json();
            const totalPages = firstBody.total_pages;

            // Get last page
            const lastPageResponse = await request.get(`/api/unknown?page=${totalPages}`);
            const lastPageBody = await lastPageResponse.json();

            expect(lastPageBody.page).toBe(totalPages);
            expect(lastPageBody.data.length).toBeGreaterThan(0);
            expect(lastPageBody.data.length).toBeLessThanOrEqual(lastPageBody.per_page);
        });
    });
});

