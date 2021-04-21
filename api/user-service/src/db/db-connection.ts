
import { Pool, ClientConfig } from 'pg';
import { DbConfig } from '../models/db-config';
export class DbConnection {

    private pool: Pool;
    
    /**
     *Creates an instance of DbConfig.
     * @param {DbConfig} config
     * @memberof DbConfig
     */
    constructor(private config: DbConfig) {
        
        if (this.config == null) {
            throw new Error('db connection cannot be null')
        }
        // const connection: ClientConfig = this.config;
        this.pool = new Pool(this.config);
    }

    query(text: string, params: any[]) {
        return this.pool.query(text, params)
    }

}

