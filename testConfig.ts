import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const testConfig = {
    // Environment
    env: process.env.ENV || 'staging',

    // Base URLs
    internet: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    api: process.env.API_URL || 'https://reqres.in',

    // Credentials
    username: process.env.USERNAME || 'admin',
    password: process.env.PASSWORD || 'admin',

    // Timeouts (in milliseconds)
    waitForElement: Number(process.env.WAIT_FOR_ELEMENT) || 20000,

    // Database Configuration
    db: {
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || '',
        host: process.env.DB_HOST || '',
        port: process.env.DB_PORT || '5432',
    },

    // Encryption Key
    encryptionKey: process.env.ENCRYPTION_KEY || '1234567890',
} as const;