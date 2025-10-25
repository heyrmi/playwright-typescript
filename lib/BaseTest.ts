import { BasicAuthPage } from '@/pageFactory/BasicAuthPage';
import { CheckboxesPage } from '@/pageFactory/CheckboxesPage';
import { DropdownPage } from '@/pageFactory/DropdownPage';
import { FileUploadPage } from '@/pageFactory/FileUploadPage';
import { FormAuthenticationPage } from '@/pageFactory/FormAuthenticationPage';
import { HerokuHomePage } from '@/pageFactory/HerokuHomePage';
import { JavaScriptAlertsPage } from '@/pageFactory/JavaScriptAlertsPage';
import { WebActions } from './WebActions';
import { ApiActions } from './ApiActions';

import AxeBuilder from '@axe-core/playwright';
import { test as baseTest } from '@playwright/test';

/**
 * This fixture provides all page objects and helper classes as dependencies
 */
const test = baseTest.extend<{
    // Utility fixtures
    webActions: WebActions;
    apiActions: ApiActions;
    makeAxeBuilder: AxeBuilder;

    // Page Object fixtures
    herokuHomePage: HerokuHomePage;
    basicAuthPage: BasicAuthPage;
    formAuthenticationPage: FormAuthenticationPage;
    dropdownPage: DropdownPage;
    checkboxesPage: CheckboxesPage;
    fileUploadPage: FileUploadPage;
    javascriptAlertsPage: JavaScriptAlertsPage;
}>({
    // Utility fixtures
    webActions: async ({ page, context }, use): Promise<void> => {
        await use(new WebActions(page, context));
    },

    apiActions: async ({ request }, use): Promise<void> => {
        await use(new ApiActions(request));
    },

    makeAxeBuilder: async ({ page }, use): Promise<void> => {
        await use(new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .exclude('aria-hidden'));
    },

    // Page Object fixtures
    herokuHomePage: async ({ page, context }, use): Promise<void> => {
        await use(new HerokuHomePage(page, context));
    },

    basicAuthPage: async ({ page, context }, use): Promise<void> => {
        await use(new BasicAuthPage(page, context));
    },

    formAuthenticationPage: async ({ page, context }, use): Promise<void> => {
        await use(new FormAuthenticationPage(page, context));
    },

    dropdownPage: async ({ page, context }, use): Promise<void> => {
        await use(new DropdownPage(page, context));
    },

    checkboxesPage: async ({ page, context }, use): Promise<void> => {
        await use(new CheckboxesPage(page, context));
    },

    fileUploadPage: async ({ page, context }, use): Promise<void> => {
        await use(new FileUploadPage(page, context));
    },

    javascriptAlertsPage: async ({ page, context }, use): Promise<void> => {
        await use(new JavaScriptAlertsPage(page, context));
    },
});

export default test;