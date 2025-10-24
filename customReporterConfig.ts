import { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import * as winston from 'winston';

// Console log configuration
const console = new winston.transports.Console();
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        console
    ]
});

logger.add(console);

export default class CustomReporterConfig implements Reporter {
    onTestBegin(test: TestCase): void {
        logger.info(`Test Case Started: ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        logger.info(`Test Case Completed: ${test.title} Status ${result.status}`);
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === 'test.step') {
            logger.info(`Executing Step: ${step.title}`);
        }
    }

    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === 'test.step') {
            logger.info('Step Completed: ${step.title}');
        }
    }
}