import { Router } from "express";
import { DbConnection } from "../db/db-connection";
import { TaskRepository } from "../db/task-repository";
import { DbConfig } from "../models/db-config";



const config: DbConfig = {

}
const connection = new DbConnection(config);
const taskRep = new TaskRepository(connection)
const granularity = process.env.GRANULARITY == null ? 1 : +process.env.GRANULARITY
const taskRouter = Router()



taskRouter.post('/subscribe', async (req, res) => {
    
})

export default taskRouter;
