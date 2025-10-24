import { BasicAuthPage } from '@/pageFactory/BasicAuthPage';
import { HerokuHomePage } from '@/pageFactory/HerokuHomePage';
import { WebActions } from './WebActions';

import AxeBuilder from '@axe-core/playwright';
import { test as baseTest } from '@playwright/test';


const test = baseTest.extend<{
    webActions: WebActions;

    makeAxeBuilder: AxeBuilder;
    herokuHomePage: HerokuHomePage;
    basicAuthPage: BasicAuthPage;

}>({
    webActions: async ({ page, context }, use): Promise<void> => {
        await use(new WebActions(page, context));
    },

    makeAxeBuilder: async ({ page }, use): Promise<void> => {
        await use(new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .exclude('aria-hidden'));
    },
    herokuHomePage: async ({ page, context }, use): Promise<void> => {
        await use(new HerokuHomePage(page, context));
    },
    basicAuthPage: async ({ page, context }, use): Promise<void> => {
        await use(new BasicAuthPage(page, context));
    },
});

export default test;