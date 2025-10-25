import { FileUtils } from '@/lib/utils/FileUtils';
import path from 'path';

/**
 * Test Data Management
 * Centralized access to test data from JSON files
 */

interface User {
    username?: string;
    password: string;
    email?: string;
    description: string;
}

interface UsersData {
    validUsers: User[];
    invalidUsers: User[];
    apiUsers: User[];
}

export class TestData {
    private static usersData: UsersData | null = null;

    /**
     * Get users test data
     * @returns Users data object
     */
    static getUsers(): UsersData {
        if (!this.usersData) {
            const dataPath = path.join(process.cwd(), 'testData', 'users.json');
            this.usersData = FileUtils.readJsonFile<UsersData>(dataPath);
        }
        return this.usersData;
    }

    /**
     * Get valid user for authentication tests
     * @param index - Index of the user (defaults to 0)
     * @returns Valid user object
     */
    static getValidUser(index: number = 0): User {
        const users = this.getUsers();
        if (index >= users.validUsers.length) {
            throw new Error(`User index ${index} out of bounds`);
        }
        return users.validUsers[index];
    }

    /**
     * Get invalid user for negative testing
     * @param index - Index of the user (defaults to 0)
     * @returns Invalid user object
     */
    static getInvalidUser(index: number = 0): User {
        const users = this.getUsers();
        if (index >= users.invalidUsers.length) {
            throw new Error(`User index ${index} out of bounds`);
        }
        return users.invalidUsers[index];
    }

    /**
     * Get API user for API tests
     * @param index - Index of the user (defaults to 0)
     * @returns API user object
     */
    static getApiUser(index: number = 0): User {
        const users = this.getUsers();
        if (index >= users.apiUsers.length) {
            throw new Error(`User index ${index} out of bounds`);
        }
        return users.apiUsers[index];
    }

    /**
     * Get random valid user
     * @returns Random valid user object
     */
    static getRandomValidUser(): User {
        const users = this.getUsers();
        const randomIndex = Math.floor(Math.random() * users.validUsers.length);
        return users.validUsers[randomIndex];
    }

    /**
     * Generate unique test data
     * @param prefix - Prefix for generated data
     * @returns Object with unique test data
     */
    static generateUniqueData(prefix: string = 'test') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);

        return {
            username: `${prefix}_user_${timestamp}_${random}`,
            email: `${prefix}_${timestamp}_${random}@test.com`,
            name: `Test User ${timestamp}`,
            timestamp,
            random
        };
    }
}

