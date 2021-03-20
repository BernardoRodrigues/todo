

const bcrypt = require('bcrypt');
const db = require('.');
const NotFoundError = require('./not-found.error');

async function login(email, userPassword) {
    try {
        const { rows } = await db.query(
            `select user_id as id, user_email as email, user_password as password, first_name as firstName, last_name as lastName 
        from user_account 
        where user_email = $1`, [email])
        const {password, ...res} = rows[0]
        const result = await bcrypt.compare(userPassword, password)
        if (result) return res;
        //TODO add custom error
        throw new Error();
    } catch(err) {
        //TODO finish error
        if (err instanceof NotFoundError) {

        }
        
        console.error(err)
        throw err
    }
    
}

/**
 * creates new entry for user
 * @param {pool} db
 * @param {user model} [user={email, password, firstName, lastName}] user
 * @returns user uuid
 */
async function signup(db, user = {email, password, firstName, lastName}) {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const { rows } = await db.query(
            `insert into user_account(user_email, user_password, password_salt, first_name, last_name) 
            values 
            ($1, $2, $3, $4) returning user_id as id`,
            [user.email, hashedPassword, salt, user.firstName, user.lastName]
            )
        return rows[0]
    } catch(err) {
        //TODO add custom error
        console.error(err)
        throw err;
    }
}
/**
 *
 *
 * @param {Pool} db
 * @param {String} email
 * @param {String} password
 * @returns
 */
async function deleteUserById(db, id) {
    try {
        const { rows } = await db.query(
            `delete from user_account where user_id = $1`,
            id
            )
        return rows[0]
    } catch(err) {
        console.error(err)
    }
}

/**
 * 
 * @param {pool} db 
 * @param {string} email 
 * @returns user 
 * @throws 
 */
async function findUser(db, email) {
    try {
        const { rows } = await db.query(
            `select user_id as id, user_email as email, user_password as password, first_name as firstName, last_name as lastName 
            from user_account as ua 
            where ua.user_email = $1`,
            email
            )
        if (rows == null || rows.length === 0) {
            //TODO add text
            throw new NotFoundError('')
        }
        return rows[0];
    } catch(err) {
        if (err)
        console.log(err)
        // TODO create custom errors
        throw err;
    }
}


module.exports = (pepper, db) => {
    return {
        signup: (user) => signup(db, user),
        login: (email, password) => login(db, email, password),
        deleteUserById: (id) => deleteUserById(db, id),
        findUser: (email) => findUser(db, email)
    }
}