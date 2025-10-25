import test from '@lib/BaseTest';

/**
 * Functional Tests for Form Elements
 * Tests checkboxes, dropdowns, and form interactions
 */
test.describe('Form Elements Tests', () => {
    test.describe('Checkboxes', () => {
        test.beforeEach(async ({ checkboxesPage }) => {
            await checkboxesPage.goto();
        });

        test('should display checkboxes page', async ({ checkboxesPage }) => {
            await checkboxesPage.expectPageHeaderToBeVisible();
            await checkboxesPage.expectCheckboxCount(2);
        });

        test('should check and uncheck checkboxes', async ({ checkboxesPage }) => {
            // Checkbox 1 starts unchecked
            await checkboxesPage.expectCheckboxToBeUnchecked(1);

            await checkboxesPage.checkCheckbox(1);
            await checkboxesPage.expectCheckboxToBeChecked(1);

            await checkboxesPage.uncheckCheckbox(1);
            await checkboxesPage.expectCheckboxToBeUnchecked(1);
        });

        test('should toggle checkbox state', async ({ checkboxesPage }) => {
            const initialState = await checkboxesPage.isCheckboxChecked(1);

            await checkboxesPage.toggleCheckbox(1);

            // State should be opposite
            if (initialState) {
                await checkboxesPage.expectCheckboxToBeUnchecked(1);
            } else {
                await checkboxesPage.expectCheckboxToBeChecked(1);
            }
        });

        test('should handle multiple checkbox operations', async ({ checkboxesPage }) => {
            // Check both checkboxes
            await checkboxesPage.checkCheckbox(1);
            await checkboxesPage.checkCheckbox(2);

            await checkboxesPage.expectCheckboxToBeChecked(1);
            await checkboxesPage.expectCheckboxToBeChecked(2);

            // Uncheck both
            await checkboxesPage.uncheckCheckbox(1);
            await checkboxesPage.uncheckCheckbox(2);

            await checkboxesPage.expectCheckboxToBeUnchecked(1);
            await checkboxesPage.expectCheckboxToBeUnchecked(2);
        });
    });

    test.describe('Dropdown', () => {
        test.beforeEach(async ({ dropdownPage }) => {
            await dropdownPage.goto();
        });

        test('should display dropdown page', async ({ dropdownPage }) => {
            await dropdownPage.expectPageHeaderToBeVisible();
            await dropdownPage.expectDropdownToBeVisible();
        });

        test('should select option by value', async ({ dropdownPage }) => {
            await dropdownPage.selectOptionByValue('1');
            await dropdownPage.expectSelectedOption('1');
        });

        test('should select option by label', async ({ dropdownPage }) => {
            await dropdownPage.selectOptionByLabel('Option 2');
            await dropdownPage.expectSelectedOption('2');
        });

        test('should select option by index', async ({ dropdownPage }) => {
            await dropdownPage.selectOptionByIndex(1);
            await dropdownPage.expectSelectedOption('1');
        });

        test('should have expected dropdown options', async ({ dropdownPage }) => {
            await dropdownPage.expectDropdownHasOptions([
                'Please select an option',
                'Option 1',
                'Option 2'
            ]);
        });

        test('should change dropdown selection multiple times', async ({ dropdownPage }) => {
            await dropdownPage.selectOptionByValue('1');
            await dropdownPage.expectSelectedOption('1');

            await dropdownPage.selectOptionByValue('2');
            await dropdownPage.expectSelectedOption('2');

            await dropdownPage.selectOptionByValue('1');
            await dropdownPage.expectSelectedOption('1');
        });
    });
});

