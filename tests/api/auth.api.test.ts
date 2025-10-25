import { test, expect } from '@playwright/test';

/**
 * API Tests for ReqRes Authentication Endpoints
 * Tests registration and login functionality
 */
test.describe('ReqRes API - Authentication', () => {
    test.describe('POST /api/register', () => {
        test('should register user successfully', async ({ request }) => {
            const userData = {
                email: 'eve.holt@reqres.in',
                password: 'pistol'
            };

            const response = await request.post('/api/register', {
                data: userData
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body).toHaveProperty('id');
            expect(body).toHaveProperty('token');
            expect(typeof body.id).toBe('number');
            expect(typeof body.token).toBe('string');
            expect(body.token.length).toBeGreaterThan(0);
        });

        test('should fail registration without password', async ({ request }) => {
            const userData = {
                email: 'sydney@fife'
            };

            const response = await request.post('/api/register', {
                data: userData
            });

            expect(response.status()).toBe(400);

            const body = await response.json();
            expect(body).toHaveProperty('error');
            expect(body.error).toContain('password');
        });

        test('should fail registration without email', async ({ request }) => {
            const userData = {
                password: 'testpassword'
            };

            const response = await request.post('/api/register', {
                data: userData
            });

            expect(response.status()).toBe(400);

            const body = await response.json();
            expect(body).toHaveProperty('error');
        });

        test('should fail registration with undefined user', async ({ request }) => {
            const userData = {
                email: 'invalid@email.com',
                password: 'password'
            };

            const response = await request.post('/api/register', {
                data: userData
            });

            expect(response.status()).toBe(400);

            const body = await response.json();
            expect(body).toHaveProperty('error');
        });
    });

    test.describe('POST /api/login', () => {
        test('should login successfully', async ({ request }) => {
            const credentials = {
                email: 'eve.holt@reqres.in',
                password: 'cityslicka'
            };

            const response = await request.post('/api/login', {
                data: credentials
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body).toHaveProperty('token');
            expect(typeof body.token).toBe('string');
            expect(body.token.length).toBeGreaterThan(0);
        });

        test('should fail login without password', async ({ request }) => {
            const credentials = {
                email: 'eve.holt@reqres.in'
            };

            const response = await request.post('/api/login', {
                data: credentials
            });

            expect(response.status()).toBe(400);

            const body = await response.json();
            expect(body).toHaveProperty('error');
            expect(body.error).toContain('password');
        });

        test('should fail login without email', async ({ request }) => {
            const credentials = {
                password: 'password'
            };

            const response = await request.post('/api/login', {
                data: credentials
            });

            expect(response.status()).toBe(400);

            const body = await response.json();
            expect(body).toHaveProperty('error');
        });

        test('should fail login with invalid credentials', async ({ request }) => {
            const credentials = {
                email: 'invalid@user.com',
                password: 'wrongpassword'
            };

            const response = await request.post('/api/login', {
                data: credentials
            });

            expect(response.status()).toBe(400);
        });

        test('should verify response headers for login', async ({ request }) => {
            const credentials = {
                email: 'eve.holt@reqres.in',
                password: 'cityslicka'
            };

            const response = await request.post('/api/login', {
                data: credentials
            });

            const headers = response.headers();
            expect(headers['content-type']).toContain('application/json');
        });
    });

    test.describe('Security Tests', () => {
        test('should not expose sensitive information in error messages', async ({ request }) => {
            const credentials = {
                email: 'test@test.com',
                password: 'wrongpassword'
            };

            const response = await request.post('/api/login', {
                data: credentials
            });

            const body = await response.json();
            expect(response.status()).toBe(400);

            // Error should not contain sensitive info like database details, stack traces, etc.
            const bodyString = JSON.stringify(body).toLowerCase();
            expect(bodyString).not.toContain('sql');
            expect(bodyString).not.toContain('database');
            expect(bodyString).not.toContain('stack');
        });
    });
});

