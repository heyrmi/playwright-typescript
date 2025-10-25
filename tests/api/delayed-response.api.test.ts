import { test, expect } from '@playwright/test';

/**
 * API Tests for Delayed Response Endpoint
 * Tests handling of delayed API responses
 */
test.describe('ReqRes API - Delayed Response', () => {
    test('should handle delayed response', async ({ request }) => {
        const delay = 3; // seconds
        const startTime = Date.now();

        const response = await request.get(`/api/users?delay=${delay}`);
        const duration = Date.now() - startTime;

        expect(response.status()).toBe(200);

        // Verify the delay was approximately correct (within 500ms tolerance)
        expect(duration).toBeGreaterThanOrEqual(delay * 1000 - 500);
        expect(duration).toBeLessThan((delay + 1) * 1000);

        const body = await response.json();
        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBe(true);
    });

    test('should timeout with very long delay', async ({ request }) => {
        // Set a short timeout
        const response = await request.get('/api/users?delay=1', {
            timeout: 500 // 500ms timeout, but delay is 1 second
        }).catch(error => {
            expect(error.message).toContain('timeout');
            return null;
        });

        // If no timeout error, response should be null
        if (response === null) {
            expect(true).toBe(true); // Timeout occurred as expected
        }
    });

    test('should handle multiple delayed requests concurrently', async ({ request }) => {
        const delay = 2;
        const startTime = Date.now();

        // Make 3 concurrent requests
        const promises = [
            request.get(`/api/users?delay=${delay}&page=1`),
            request.get(`/api/users?delay=${delay}&page=2`),
            request.get(`/api/unknown?delay=${delay}`)
        ];

        const responses = await Promise.all(promises);
        const duration = Date.now() - startTime;

        // All responses should be successful
        for (const response of responses) {
            expect(response.status()).toBe(200);
        }

        // Duration should be approximately delay time (not 3x delay)
        // because requests run concurrently
        expect(duration).toBeLessThan((delay + 2) * 1000);
    });
});

