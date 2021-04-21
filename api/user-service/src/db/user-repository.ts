import { NotFoundError } from './../errors/not-found-error';
import { BadLoginError } from './../errors/bad-login-error';
import { UserModel } from './../models/user-model';
import { DbConnection } from './db-connection'
import bcrypt from 'bcrypt'
//TODO connection from where?
// import { NotFoundError } from './not-found.error';
export class UserRepository {

    constructor(private db: DbConnection) {
    }

    private mapper({id, email, firstname, lastname}): UserModel {
        return {
            id: id,
            email: email,
            firstName: firstname,
            lastName: lastname
        };
    }

    /**
     *
     * @param {string} email
     * @param {string} userPassword
     * @returns {Promise<UserModel>}
     * @memberof UserRepository
     * @throws {Error}
     */
    public async login(email: string, userPassword: string): Promise<UserModel> {
        try {
            const { rows } = await this.db.query(
                `select user_id as id, user_email as email, user_password as password, first_name as firstName, last_name as lastName from user_account where user_email = $1`,
                [email])
            const {password, ...res} = rows[0]
            const result = await bcrypt.compare(userPassword, password)
            if (result) return this.mapper(res);
            //TODO add custom error
            throw new BadLoginError("Bad credentials")
        } catch(err) {
            //TODO finish error
            console.error(err)
            throw err
        }
        
    }

    /**
     * creates new entry for user
     * @param {User model} [user={email, password, firstName, lastName}]
     * @returns user uuid
     */
    public async signup({email, password, firstName, lastName}: UserModel): Promise<string> {
        try {
            console.log("Starting signup");
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const { rows } = await this.db.query(
                `insert into user_account(user_email, user_password, password_salt, first_name, last_name) 
                values 
                ($1, $2, $3, $4, $5) returning user_id as id`,
                [email, hashedPassword, salt, firstName, lastName]
                )
            console.log("Returning");
            return rows[0].id
        } catch(err) {
            //TODO add custom error
            console.error(err)
            throw err;
        }
    }
    /**
     *
     * @param {String} email
     * @param {String} password
     * @returns
     */
    public async deleteUserById(id: string) {
        try {
            const { rows } = await this.db.query(
                `delete from user_account where user_id = $1`,
                [id]
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
    public async findUser(id: string): Promise<UserModel> {
        try {
            const { rows } = await this.db.query(
                `select user_id as id, user_email as email, user_password as password, first_name as firstName, last_name as lastName 
                from user_account as ua 
                where ua.user_id = $1`,
                [id]
                )
            if (rows == null || rows.length === 0) {
                //TODO add text
                throw new NotFoundError('user was not found')
            }
            return this.mapper(rows[0]);
        } catch(err) {
            console.log(err)
            // TODO create custom errors
            throw err;
        }
    }

}