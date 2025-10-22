import {expect, test} from '@playwright/test';
import {DBActions} from '@lib/DBActions';
import {testConfig as tc} from '@/testConfig';

test('Connect to postgres db', async () => {
    const dbConnection = new DBActions();
    await dbConnection.connectToDB(tc.dbUsername, tc.password, tc.dbHost, tc.dbPort, tc.dbName);
    const result = await dbConnection.executeQuery('SELECT * FROM users');
    expect(result, 'unable to obtain users data').toEqual(
        [
            {
                id: 1,
                name: 'John',
                email: '',
                password: '',
                balance: 1000
            }
        ]
    );
});