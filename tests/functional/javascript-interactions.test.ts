import test from '@lib/BaseTest';

/**
 * Functional Tests for JavaScript Interactions
 * Tests handling of JavaScript alerts, confirms, and prompts
 */
test.describe('JavaScript Interactions Tests', () => {
    test.describe('JavaScript Alerts', () => {
        test.beforeEach(async ({ javascriptAlertsPage }) => {
            await javascriptAlertsPage.goto();
        });

        test('should display alerts page', async ({ javascriptAlertsPage }) => {
            await javascriptAlertsPage.expectPageHeaderToBeVisible();
            await javascriptAlertsPage.expectAllButtonsVisible();
        });

        test('should handle JS Alert and accept', async ({ javascriptAlertsPage, page }) => {
            // Set up dialog handler
            page.once('dialog', async (dialog) => {
                test.expect(dialog.type()).toBe('alert');
                test.expect(dialog.message()).toBe('I am a JS Alert');
                await dialog.accept();
            });

            await javascriptAlertsPage.clickJSAlert();
            await javascriptAlertsPage.expectResultText('You successfully clicked an alert');
        });

        test('should handle JS Confirm and accept', async ({ javascriptAlertsPage, page }) => {
            page.once('dialog', async (dialog) => {
                test.expect(dialog.type()).toBe('confirm');
                test.expect(dialog.message()).toBe('I am a JS Confirm');
                await dialog.accept();
            });

            await javascriptAlertsPage.clickJSConfirm();
            await javascriptAlertsPage.expectResultText('You clicked: Ok');
        });

        test('should handle JS Confirm and dismiss', async ({ javascriptAlertsPage, page }) => {
            page.once('dialog', async (dialog) => {
                test.expect(dialog.type()).toBe('confirm');
                await dialog.dismiss();
            });

            await javascriptAlertsPage.clickJSConfirm();
            await javascriptAlertsPage.expectResultText('You clicked: Cancel');
        });

        test('should handle JS Prompt with text input', async ({ javascriptAlertsPage, page }) => {
            const promptText = 'Hello Playwright!';

            page.once('dialog', async (dialog) => {
                test.expect(dialog.type()).toBe('prompt');
                test.expect(dialog.message()).toBe('I am a JS prompt');
                await dialog.accept(promptText);
            });

            await javascriptAlertsPage.clickJSPrompt();
            await javascriptAlertsPage.expectResultText(`You entered: ${promptText}`);
        });

        test('should handle JS Prompt dismissal', async ({ javascriptAlertsPage, page }) => {
            page.once('dialog', async (dialog) => {
                test.expect(dialog.type()).toBe('prompt');
                await dialog.dismiss();
            });

            await javascriptAlertsPage.clickJSPrompt();
            await javascriptAlertsPage.expectResultText('You entered: null');
        });

        test('should handle empty prompt input', async ({ javascriptAlertsPage, page }) => {
            page.once('dialog', async (dialog) => {
                await dialog.accept(''); // Accept with empty string
            });

            await javascriptAlertsPage.clickJSPrompt();
            await javascriptAlertsPage.expectResultText('You entered:');
        });
    });
});

