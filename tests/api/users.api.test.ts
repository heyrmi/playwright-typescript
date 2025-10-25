import { test, expect } from '@playwright/test';

/**
 * API Tests for ReqRes Users Endpoints
 * Tests CRUD operations on user resources
 */
test.describe('ReqRes API - Users', () => {
    test.describe('GET /api/users', () => {
        test('should get list of users with pagination', async ({ request }) => {
            const response = await request.get('/api/users?page=2');

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body).toHaveProperty('page', 2);
            expect(body).toHaveProperty('per_page');
            expect(body).toHaveProperty('total');
            expect(body).toHaveProperty('total_pages');
            expect(body).toHaveProperty('data');
            expect(Array.isArray(body.data)).toBe(true);
            expect(body.data.length).toBeGreaterThan(0);
        });

        test('should verify user object structure', async ({ request }) => {
            const response = await request.get('/api/users?page=1');
            const body = await response.json();

            const firstUser = body.data[0];
            expect(firstUser).toHaveProperty('id');
            expect(firstUser).toHaveProperty('email');
            expect(firstUser).toHaveProperty('first_name');
            expect(firstUser).toHaveProperty('last_name');
            expect(firstUser).toHaveProperty('avatar');

            // Verify data types
            expect(typeof firstUser.id).toBe('number');
            expect(typeof firstUser.email).toBe('string');
            expect(firstUser.email).toContain('@');
        });

        test('should get single user by ID', async ({ request }) => {
            const userId = 2;
            const response = await request.get(`/api/users/${userId}`);

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.data).toHaveProperty('id', userId);
            expect(body.data).toHaveProperty('email');
            expect(body.data).toHaveProperty('first_name');
            expect(body.data).toHaveProperty('last_name');
        });

        test('should return 404 for non-existent user', async ({ request }) => {
            const response = await request.get('/api/users/999');
            expect(response.status()).toBe(404);
        });

        test('should have correct response headers', async ({ request }) => {
            const response = await request.get('/api/users?page=1');
            const headers = response.headers();

            expect(headers['content-type']).toContain('application/json');
            expect(response.ok()).toBe(true);
        });
    });

    test.describe('POST /api/users', () => {
        test('should create a new user', async ({ request }) => {
            const newUser = {
                name: 'John Doe',
                job: 'QA Engineer'
            };

            const response = await request.post('/api/users', {
                data: newUser
            });

            expect(response.status()).toBe(201);

            const body = await response.json();
            expect(body).toHaveProperty('id');
            expect(body).toHaveProperty('createdAt');
            expect(body.name).toBe(newUser.name);
            expect(body.job).toBe(newUser.job);

            // Verify createdAt is a valid ISO date
            expect(new Date(body.createdAt).toString()).not.toBe('Invalid Date');
        });

        test('should create user with minimal data', async ({ request }) => {
            const response = await request.post('/api/users', {
                data: { name: 'Test User' }
            });

            expect(response.status()).toBe(201);

            const body = await response.json();
            expect(body).toHaveProperty('id');
            expect(body.name).toBe('Test User');
        });
    });

    test.describe('PUT /api/users/:id', () => {
        test('should update user with PUT', async ({ request }) => {
            const userId = 2;
            const updatedUser = {
                name: 'Jane Doe',
                job: 'Senior QA Engineer'
            };

            const response = await request.put(`/api/users/${userId}`, {
                data: updatedUser
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body).toHaveProperty('updatedAt');
            expect(body.name).toBe(updatedUser.name);
            expect(body.job).toBe(updatedUser.job);
        });
    });

    test.describe('PATCH /api/users/:id', () => {
        test('should partially update user with PATCH', async ({ request }) => {
            const userId = 2;
            const partialUpdate = {
                job: 'Lead QA Engineer'
            };

            const response = await request.patch(`/api/users/${userId}`, {
                data: partialUpdate
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body).toHaveProperty('updatedAt');
            expect(body.job).toBe(partialUpdate.job);
        });
    });

    test.describe('DELETE /api/users/:id', () => {
        test('should delete user', async ({ request }) => {
            const userId = 2;
            const response = await request.delete(`/api/users/${userId}`);

            expect(response.status()).toBe(204);
        });
    });

    test.describe('Performance Tests', () => {
        test('should respond within acceptable time', async ({ request }) => {
            const startTime = Date.now();
            const response = await request.get('/api/users?page=1');
            const duration = Date.now() - startTime;

            expect(response.status()).toBe(200);
            expect(duration).toBeLessThan(2000); // Should respond within 2 seconds
        });
    });
});

