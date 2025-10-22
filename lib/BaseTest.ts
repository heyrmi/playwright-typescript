import {test as baseTest} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const test = baseTest.extend<{
    makeAxeBuilder: AxeBuilder;
}>({
    makeAxeBuilder: async ({page}, use): Promise<void> => {
        await use(new AxeBuilder({page})
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        );
    }
});

export default test;