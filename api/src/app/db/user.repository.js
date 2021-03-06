




// module.exports = (pepper = 10, db) => {
//     return {
//         signup: (user) => signup(db, user),
//         login: (email, password) => login(db, email, password),
//         deleteUserById: (id) => deleteUserById(db, id),
//         findUser: (id) => findUser(db, id)
//     }
// }

import { DbConfig } from './db-config'
import bcrypt from 'bcrypt'
//TODO connection from where?
import { NotFoundError} from './not-found.error';
export class UserRepository {

    #db

    constructor(connection) {
        this.#db = new DbConfig(connection);
    }

    async login(email, userPassword) {
        try {
            const { rows } = await this.#db.query(
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
     * @param {user model} [user={email, password, firstName, lastName}] user
     * @returns user uuid
     */
    async signup({email, password, firstName, lastName}) {
        try {
            console.log("Starting signup");
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const { rows } = await this.#db.query(
                `insert into user_account(user_email, user_password, password_salt, first_name, last_name) 
                values 
                ($1, $2, $3, $4, $5) returning user_id as id`,
                [email, hashedPassword, salt, firstName, lastName]
                )
            console.log("Returning");
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
     * @param {String} email
     * @param {String} password
     * @returns
     */
    async deleteUserById(id) {
        try {
            const { rows } = await this.#db.query(
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
    async findUser(id) {
        try {
            const { rows } = await this.#db.query(
                `select user_id as id, user_email as email, user_password as password, first_name as firstName, last_name as lastName 
                from user_account as ua 
                where ua.user_id = $1`,
                id
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

}