import { Client, QueryResult } from 'pg';

/**
 * Database Actions class for PostgreSQL operations
 * Provides connection management and query execution with comprehensive methods
 */
export class DBActions {
    private client: Client | null = null;
    private isConnected = false;

    /**
     * Connect to PostgreSQL database
     * @param username - Database username
     * @param password - Database password
     * @param host - Database host
     * @param port - Database port
     * @param name - Database name
     */
    async connect(username: string, password: string, host: string, port: string, name: string): Promise<void> {
        try {
            const connectionString = `postgres://${username}:${password}@${host}:${port}/${name}`;
            this.client = new Client({ connectionString });
            await this.client.connect();
            this.isConnected = true;
        } catch (error) {
            this.isConnected = false;
            throw new Error(`Failed to connect to database: ${error}`);
        }
    }

    /**
     * Disconnect from database
     */
    async disconnect(): Promise<void> {
        if (this.client && this.isConnected) {
            try {
                await this.client.end();
                this.isConnected = false;
                this.client = null;
            } catch (error) {
                throw new Error(`Failed to disconnect from database: ${error}`);
            }
        }
    }

    /**
     * Execute a SQL query with optional parameters
     * @param query - SQL query string
     * @param params - Optional query parameters for parameterized queries
     * @returns Query result
     */
    async executeQuery<T>(query: string, params?: any[]): Promise<QueryResult<T>> {
        if (!this.client || !this.isConnected) {
            throw new Error('Database not connected. Call connect() first.');
        }

        try {
            return await this.client.query<T>(query, params);
        } catch (error) {
            throw new Error(`Query execution failed: ${error}\nQuery: ${query}`);
        }
    }

    /**
     * Execute a SELECT query and return rows
     * @param query - SELECT query string
     * @param params - Optional query parameters
     * @returns Array of rows
     */
    async select<T>(query: string, params?: any[]): Promise<T[]> {
        const result = await this.executeQuery<T>(query, params);
        return result.rows;
    }

    /**
     * Execute an INSERT query and return inserted row(s)
     * @param query - INSERT query string with RETURNING clause
     * @param params - Query parameters
     * @returns Inserted row(s)
     */
    async insert<T>(query: string, params?: any[]): Promise<T[]> {
        const result = await this.executeQuery<T>(query, params);
        return result.rows;
    }

    /**
     * Execute an UPDATE query and return updated row(s)
     * @param query - UPDATE query string with RETURNING clause
     * @param params - Query parameters
     * @returns Updated row(s)
     */
    async update<T>(query: string, params?: any[]): Promise<T[]> {
        const result = await this.executeQuery<T>(query, params);
        return result.rows;
    }

    /**
     * Execute a DELETE query and return deleted row(s)
     * @param query - DELETE query string with RETURNING clause
     * @param params - Query parameters
     * @returns Deleted row(s)
     */
    async delete<T>(query: string, params?: any[]): Promise<T[]> {
        const result = await this.executeQuery<T>(query, params);
        return result.rows;
    }

    /**
     * Check if database is connected
     * @returns true if connected, false otherwise
     */
    isDbConnected(): boolean {
        return this.isConnected;
    }

    /**
     * Execute a transaction with multiple queries
     * @param queries - Array of query objects with query string and params
     * @returns Array of query results
     */
    async executeTransaction<T>(queries: { query: string; params?: any[] }[]): Promise<QueryResult<T>[]> {
        if (!this.client || !this.isConnected) {
            throw new Error('Database not connected. Call connect() first.');
        }

        try {
            await this.client.query('BEGIN');
            const results: QueryResult<T>[] = [];

            for (const { query, params } of queries) {
                const result = await this.client.query<T>(query, params);
                results.push(result);
            }

            await this.client.query('COMMIT');
            return results;
        } catch (error) {
            await this.client.query('ROLLBACK');
            throw new Error(`Transaction failed and was rolled back: ${error}`);
        }
    }
}
