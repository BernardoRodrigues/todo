
import { Pool } from 'pg';
export class DbConnection {

    private pool: Pool;
    
    /**
     *Creates an instance of DbConfig.
     * @param {DbConfig} config
     * @memberof DbConfig
     */
    constructor(private config?: string) {
        
        // const connection: ClientConfig = this.config;
        if (process.env.NODE_ENV === 'prd') {
            this.pool = new Pool({connectionString: this.config, ssl:{rejectUnauthorized: false}});
        } else {
            this.pool = new Pool();
        }
    }

    query(text: string, params: any[]) {
        return this.pool.query(text, params)
    }

}

