import { DbConnection } from '../db/db-connection';
import { UserModel } from './../models/user-model';
import { Router } from "express";
import { UserRepository } from "../db/user-repository";
import { DbConfig } from "../models/db-config";
import { verify, sign, decode } from 'jsonwebtoken' 
import { authenticate, use } from 'passport'
import { readFileSync } from 'fs'
// postgres://postgres:postgres@localhost:5432/todo_db
const config: DbConfig = {
    user: "postgres",
    password: "postgres",
    port: 5432,
    database: "todo_db",
    host: "localhost"
};
const connection = new DbConnection(config);
const userRepository = new UserRepository(connection);
const userRouter = Router()
// const secretJson = JSON.parse(readFileSync('./file-utils/secret.json').toString())
const secret = 'blah_blah_blah';
userRouter.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userRepository.login(email, password);
        if (user == null) {
            return res.status(400).json({message: 'bad login'})
        }
        const token = sign({ id: user.id }, secret, {algorithm: 'HS256', noTimestamp: true})
        console.table(user);
        authenticate('jwt', {session: false}, () => {
        });
        return res.status(200).json({token: token, email: user.email, firstName: user.firstName, lastName: user.lastName})
    } catch(err) {
        console.warn("todo")
        return res.status(400).send({message: 'permissions'})
        //TODO warn of bad login
    }
})
// .get()

//TODO add audience, issue, certificate, etc
//TODO validate if I need this route
userRouter.get('/validate',(req, res) => {
    try {
        // const value = verify(token, secret, {algorithms: 'HS256'}).id
        return res.status(200).json({id: ''});
    } catch (err) {
        return res.status(400)
    }
})

userRouter.post('/signup', async (req, res) => {
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
        const token = sign({ id: user.id }, secret, {algorithm: 'HS256', noTimestamp: true})
        authenticate('jwt', {session: false}, () => {
        });
        return res.status(201).json({token: token})
    } catch(err) {
        return res.status(400).json(err.message)
    }
})

userRouter.delete('/', authenticate('jwt', {session: false}), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const id = decode(token)['id'] as string;
    try {
        const result = userRepository.deleteUserById(id)
        if (result) {
            res.removeHeader('Authorization')
            //TODO add custom reply
            return res.status(200).json({})
        }
    } catch(err) {
        res.status(400).json({})
    }
})

userRouter.get('/logout', authenticate('jwt', {session: false}), (req, res) => {
    res.removeHeader('Authorization')
    res.status(200).json({});
})

export default userRouter;