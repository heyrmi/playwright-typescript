import {devices, PlaywrightTestConfig} from '@playwright/test';
import {OrtoniReportConfig} from 'ortoni-report';
import {testConfig} from "@/testConfig";

// Get ENV value from command line or default to 'staging'
const ENV = process.env.ENV || 'staging';

// Validate ENV value
if (!ENV || !['staging', 'production'].includes(ENV)) {
    console.log(`Invalid ENV value: ${ENV}. Allowed values are 'staging' or 'production'.`);
    process.exit();
}

// HTML report config
const reportConfig: OrtoniReportConfig = {
    base64Image: true,
    title: `Playwright E2E Test Report - ${ENV.toUpperCase()} Environment`,
    showProject: true,
    projectName: `E2E Tests - ${ENV}`,
    authorName: 'Rahul Mishra',
    folderPath: 'html-reports',
    filename: `report-${ENV}.html`,
    logo: 'ortoni-report/logo.png',
    testType: 'E2E',
    port: 3600,
};

// Playwright config
const config: PlaywrightTestConfig = {
    // global setup file (will remove logs, html-reports, allure-results folders)
    globalSetup: './global-setup.ts',

    // test timeouts (300 seconds = 5 minutes)
    timeout: 300000,

    // retries (0 = no retries)
    retries: 0,

    // reporter (HTML report)
    reporter: [['./customReporterConfig.ts'], ['allure-playwright'], ['html', {
        open: 'never',
        outputFolder: reportConfig.folderPath
    }], ['ortoni-report', reportConfig]],

    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                // Chrome browser configuration
                channel: 'chrome',

                // TODO: make the url configurable based on ENV for now using only static value from testConfig
                baseURL: testConfig.internet,
                headless: false,
                viewport: {width: 1920, height: 1080},
                // To ignore SSL certificate errors (for self-signed certificates testing)
                ignoreHTTPSErrors: true,
                acceptDownloads: true,

                // artefacts
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
                screenshot: 'only-on-failure',

                launchOptions: {
                    // Slow down the browser by ms for debugging purposes
                    slowMo: 0,
                    args: ['--start-maximized']
                }
            }
        },
        {
            name: 'Chromium',
            use: {
                browserName: 'chromium',
                baseURL: testConfig.internet,
                headless: true,
                viewport: {width: 1920, height: 1080},
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
                screenshot: 'only-on-failure',
                launchOptions: {
                    slowMo: 0,
                    args: ['--start-maximized']
                }
            }
        },
        {
            name: 'Firefox',
            use: {
                browserName: 'firefox',
                baseURL: testConfig.internet,
                headless: false,
                viewport: {width: 1920, height: 1080},
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
                screenshot: 'only-on-failure',
                launchOptions: {
                    slowMo: 0,
                }
            }
        },
        {
            name: 'Edge',
            use: {
                browserName: 'chromium',
                channel: 'msedge',
                baseURL: testConfig.internet,
                headless: false,
                viewport: {width: 1920, height: 1080},
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
                screenshot: 'only-on-failure',
                launchOptions: {
                    slowMo: 0,
                }
            }
        },
        {
            name: 'Webkit',
            use: {
                browserName: 'webkit',
                baseURL: testConfig.internet,
                headless: false,
                viewport: {width: 1920, height: 1080},
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
                screenshot: 'only-on-failure',
                launchOptions: {
                    slowMo: 0,
                }
            }
        },
        {
            name: 'Mobile Chrome',
            use: {
                ...devices['Pixel 7'],
                browserName: 'chromium',
                channel: 'chrome',
                baseURL: testConfig.internet,
                headless: true,
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
                screenshot: 'only-on-failure',
                launchOptions: {
                    slowMo: 0,
                }
            }
        },
        {
            name: 'Mobile Safari',
            use: {
                ...devices['iPhone 15 Pro Max'],
                browserName: 'webkit',
                baseURL: testConfig.internet,
                headless: true,
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
                screenshot: 'only-on-failure',
                launchOptions: {
                    slowMo: 0,
                }
            }
        },
        {
            name: 'API',
            use: {
                baseURL: testConfig['api'],
            }
        }
    ]
};

export default config;