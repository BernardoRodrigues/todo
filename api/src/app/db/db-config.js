export class DbConfig {

    #pool 

    constructor(connection) {

        if (connection == null) {
            throw new Error('db connection cannot be null')
        }
        const { Pool } = require('pg')
        this.#pool = null;
        if (typeof connection === 'string') {
            this.#pool = new Pool({connectionString: connection})
        } else {
            this.#pool = new Pool(connection)
        }
    }

    query(text, params) {
        return this.#pool.query(text, params)
    }

}

