import { config } from 'dotenv';
import { readFileSync } from 'fs'
import { resolve } from 'path'

console.log(resolve(__dirname, '..', '..', 'environments', `${process.env.NODE_ENV}.env`))
config(
    {
        path: resolve(__dirname, '..', '..', 'environments', `${process.env.NODE_ENV}.env`)
    }
)
import { json } from 'body-parser'
import { createServer } from 'http'
import express from 'express'
import morgan from 'morgan'
import { userRouter } from './routes/user.route'
import { todoRouter } from './routes/todo.route'
import { taskRouter } from './routes/task.route'

import cors from 'cors'
const app = express();
const port = process.env.PORT || 8000;

const server = 
createServer(
//{
//       cert: readFileSync(resolve(__dirname, "cert", "gateway.crt")),
//       key: readFileSync(resolve(__dirname, "cert", "gateway.key"))
//    },
    app
        .use(morgan('dev'))
        .use(json())
        .use(cors())
        .use('/api/user', userRouter)
        .use('/api/todo', todoRouter)
        .use('/api/subscription', taskRouter)
        .use('*', (_, res) => res.status(404).json({message: "Path does not exist"}))
).listen(port, () => console.log(`Started listening on port ${port}`))

process.on("SIGINT", () => {
    console.log("Server shutting down")
    server.close()
})


