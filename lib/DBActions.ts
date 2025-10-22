import {Client, QueryResult} from 'pg';

let pgClient: Client;

export class DBActions {

    async connectToDB(dbUsername: string, dbPassword: string, dbHost: string, dbPort: string, dbName: string): Promise<void> {
        // TODO: add config to determine db type and support SQL too
        const connectionString = `postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        pgClient = new Client({connectionString: connectionString});
        await pgClient.connect();
    }

    async disconnectFromDB(): Promise<void> {
        await pgClient.end();
    }

    async executeQuery(query: string): Promise<QueryResult<any>> {
        return pgClient.query(query);
    }

    // TODO: Add more methods as needed to make comprehensive DB actions
}
