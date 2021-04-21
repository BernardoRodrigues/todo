import { DbConfig } from './../models/db-config';
import { DbConnection } from './../db/db-connection';
import { TodoRepository } from './../db/todo-repository';
import { decode } from 'jsonwebtoken'
import express from "express";
import { MissingJwtError } from '../errors/missing-jwt-error';

//TODO get secret the right way
const secret = 'blah blah blah'

const router = express.Router()
const dbConfig = {

}
const db = new DbConnection(dbConfig);
const todoRep = new TodoRepository(db)
const getUserIdFromJwt = (req: any): string => {
    const token = req.headers.authorization.split(" ")[1];
    const value = decode(token);
    if (value == null) {
        throw new MissingJwtError('jwt is null');
    }
    
    return value as {[key: string]: any}['id'];
}
router.get('/', async (req, res) => {
    try {
        const id = getUserIdFromJwt(req)
        
        const todos = await todoRep.getAllByUserId(id);
        return res.status(200).json(todos)
    } catch(err) {
        // Todo errors
        console.error(err);
        if (err instanceof MissingJwtError) {
            return res.status(405).json({message: 'Unauthorized'});
        }
        return res.status(400).json({})
        // if (err instanceof )
    } 
}).post('/', async (req, res) => {
    const { startDate, endDate, value, priority } = req.body;
    try {
        const userId = getUserIdFromJwt(req);
        const id = await todoRep.create({userId, startDate, endDate, value, priority})
        return res.status(201).json(id);
    } catch (err) {
        console.error(err)
        if (err instanceof MissingJwtError) {
            return res.status(405).json({message: 'Unauthorized'});
        }
        return res.status(400).json({})
    }
})

export default router;