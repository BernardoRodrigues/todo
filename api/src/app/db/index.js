

module.exports = (connection) => {
    const { Pool } = require('pg')
    let pool = null;
    if (typeof connection === 'string') {
        pool = new Pool({connectionString: connection})
    } else {
        pool = new Pool(connection)
    }
    return {
        query: (text, params) => pool.query(text, params)
    }
}