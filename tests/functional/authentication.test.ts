import test from '@lib/BaseTest';

/**
 * Functional Tests for Authentication
 * Tests both Basic Auth and Form Authentication
 */
test.describe('Authentication Tests', () => {
    test.describe('Basic Authentication', () => {
        test('should authenticate with valid credentials using URL', async ({ basicAuthPage }) => {
            await basicAuthPage.goto();
            await basicAuthPage.expectAuthenticationSuccess();
        });

        test('should authenticate with valid credentials using context', async ({ basicAuthPage }) => {
            await basicAuthPage.gotoWithContext();
            await basicAuthPage.expectAuthenticationSuccess();
        });

        test('should display correct page header', async ({ basicAuthPage }) => {
            await basicAuthPage.goto();
            await basicAuthPage.expectPageHeaderText('Basic Auth');
        });
    });

    test.describe('Form Authentication', () => {
        test.beforeEach(async ({ formAuthenticationPage }) => {
            await formAuthenticationPage.goto();
        });

        test('should display login form', async ({ formAuthenticationPage }) => {
            await formAuthenticationPage.expectLoginPageVisible();
        });

        test('should login with valid credentials', async ({ formAuthenticationPage }) => {
            // Note: Check the-internet.herokuapp.com for valid credentials
            // Typically: username=tomsmith, password=SuperSecretPassword!
            await formAuthenticationPage.login('tomsmith', 'SuperSecretPassword!');
            await formAuthenticationPage.expectLoginSuccess();
            await formAuthenticationPage.expectSecureAreaVisible();
        });

        test('should fail login with invalid username', async ({ formAuthenticationPage }) => {
            await formAuthenticationPage.login('invaliduser', 'SuperSecretPassword!');
            await formAuthenticationPage.expectLoginFailure();
        });

        test('should fail login with invalid password', async ({ formAuthenticationPage }) => {
            await formAuthenticationPage.login('tomsmith', 'wrongpassword');
            await formAuthenticationPage.expectLoginFailure();
        });

        test('should logout successfully', async ({ formAuthenticationPage }) => {
            // Login first
            await formAuthenticationPage.login('tomsmith', 'SuperSecretPassword!');
            await formAuthenticationPage.expectLoginSuccess();

            // Then logout
            await formAuthenticationPage.logout();
            await formAuthenticationPage.expectLogoutSuccess();
        });

        test('should handle empty credentials', async ({ formAuthenticationPage }) => {
            await formAuthenticationPage.clickLogin();
            // Form validation or error should occur
            await formAuthenticationPage.expectLoginFailure();
        });
    });
});

