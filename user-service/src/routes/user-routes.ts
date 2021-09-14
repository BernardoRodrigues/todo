import { DbConnection } from '../db/db-connection';
import { UserModel } from './../models/user-model';
import { Router } from "express";
import { UserRepository } from "../db/user-repository";
import { verify, sign, decode } from 'jsonwebtoken' 
// import passport, { authenticate, authorize, use } from 'passport'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import { BadLoginError } from '../errors/bad-login.error';
import { MissingValuesError } from '../errors/missing-values.error';
import { DuplicateEmailError } from '../errors/duplicate-email.error';
import { DbNotAvailableError } from '../errors/db-not-available.error';
import { BaseError } from '../errors/base.error';
import { CodeError } from '../errors/code.error';

const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization
    if (authToken == null || authToken === '') {
        return res.status(401).json('Unauthorized')
    }
    const token = authToken.split(' ')[1]
    console.log(`token: ${token}`)
    try {

        const value = await Promise.resolve(verify(token, key))
        console.log(`vakue: ${value}`)
        console.table(value)
        const user = await userRepository.findUser(value['id'])
        if (user == null) {
            return res.status(401).json('Unauthorized')
        }
        next()
    } catch(err) {
        console.error(err);
        return res.status(401).json('Unauthorized')
    }
}

// postgres://postgres:postgres@localhost:5432/todo_db
const connection = new DbConnection(process.env.TODO_DB_URL);
const userRepository = new UserRepository(connection);
const key = readFileSync(join(__dirname, '..', 'cert', 'server-key.pem'));
// const dir = __dirname.split("/").slice(0, __dirname.split("/").length - 1).join("/")
const userRouter = Router()
    .post('/login', async (req, res, next) => {
        const { email, password } = req.body;
        try {
            console.log("Getting user");
            const user = await userRepository.login(email, password);
            if (user == null) {
                return res.status(400).json({message: 'bad login'})
            }
            const token = await Promise.resolve(sign({ id: user.id }, key, {algorithm: 'HS256', noTimestamp: true}))
            console.table(user);
            // authenticate('jwt', {session: false});
            return res.status(200).json({token: token, email: user.email, firstName: user.firstName, lastName: user.lastName, id: user.id})
        } catch(ex) {
            const err: BaseError = ex;
            switch(err.code) {
                default:
                case CodeError.DbNotAvailable: 
                    console.warn(`${email} - ${err.code} - ${err.message}`)
                    return res.status(500).send({message: 'Server error'})
                case CodeError.BadLogin:
                    return res.status(400).json(err.message)
            }
        }
})
// .get()

//TODO add audience, issue, certificate, etc
//TODO validate if I need this route
.get('/verify-jwt', async (req, res) => {
    try {
        const value = await Promise.resolve(verify(req.query.token as string, key))
        return res.status(200).json({value: value});
    } catch (err) {
        console.error(err);
        return res.status(400)
    }
})
.post('/signup', async (req, res) => {
    // authenticate('jwt', async (error, user, info) => {
        try {
            console.log(req.body)
            let { email, password, firstName, lastName } = req.body;
            const aux: UserModel = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            };
            const id = await userRepository.signup(aux)
            console.log('User: ', aux)
            // delete aux[password];
            const user: UserModel = {...aux, id}
            const token = await Promise.resolve(sign({ id: user.id }, key, {algorithm: 'HS256', noTimestamp: true}))
            // req.login()
            return res.status(201).json({token: token, id: user.id})
        } catch(ex) {
            const err: BaseError = ex;
            switch(err.code) {
                default:
                case CodeError.DbNotAvailable:
                    return res.status(500).json({message: "Server error"});
                case CodeError.MissingValues:
                case CodeError.DuplicateEmail:
                    return res.status(400).json({message: err.message})
            }      
        } 
    // })
})
.delete('/', authenticate, async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const id = await Promise.resolve(verify(token, key))['id'];
    try {
        const result = await userRepository.deleteUserById(id)
        if (result) {
            res.removeHeader('Authorization')
            //TODO add custom reply
            return res.status(200).json({})
        }
    } catch(err) {
        console.error(err);
        return res.status(400).json({})
    }
})
.get('/logout', authenticate, (_req, res) => {
    res.removeHeader('Authorization')
    return res.status(200).json({});
})

export default userRouter;