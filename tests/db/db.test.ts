import { testConfig as tc } from '@/testConfig';
import { DBActions } from '@lib/DBActions';
import { expect, test } from '@playwright/test';

/**
 * Database Tests
 * Tests database connectivity and query execution
 * Note: Configure database credentials in .env file before running
 */
test.describe('Database Tests', () => {
    test.skip('Connect to PostgreSQL database', async () => {
        // Skip this test if DB credentials are not configured
        if (!tc.db.username || !tc.db.host) {
            test.skip();
        }

        const dbConnection = new DBActions();

        try {
            await dbConnection.connect(
                tc.db.username,
                tc.db.password,
                tc.db.host,
                tc.db.port,
                tc.db.name
            );

            expect(dbConnection.isDbConnected()).toBe(true);

            // Example query - adjust based on your database schema
            const users = await dbConnection.select('SELECT * FROM users LIMIT 5');
            expect(Array.isArray(users)).toBe(true);

            await dbConnection.disconnect();
            expect(dbConnection.isDbConnected()).toBe(false);
        } catch (error) {
            console.error('Database test failed:', error);
            throw error;
        }
    });

    test.skip('Execute parameterized query', async () => {
        if (!tc.db.username || !tc.db.host) {
            test.skip();
        }

        const dbConnection = new DBActions();

        await dbConnection.connect(
            tc.db.username,
            tc.db.password,
            tc.db.host,
            tc.db.port,
            tc.db.name
        );

        // Example parameterized query
        const users = await dbConnection.select(
            'SELECT * FROM users WHERE id = $1',
            [1]
        );

        expect(users.length).toBeGreaterThanOrEqual(0);

        await dbConnection.disconnect();
    });
});