if (process.env.NODE_ENV === 'production') {
    require('dotenv').config()
}

import express from "express";
import logger from 'morgan'
import { version } from '../package.json'
import * as todoRouter from './routes/todo-routes'
import { createServer as httpCreateServer } from "http";
import { createServer as httpsCreateServer } from "https";
import { json } from "body-parser";
const createServer = process.env.NODE_ENV === 'production' ? httpsCreateServer : httpCreateServer;

const app = express()
// const version = `v${require('./../../package.json').version.split('.')[0]}`;

const port = process.env.PORT || 5000;
const server = createServer(
    app.use(logger('dev'))
        .use(json())
        .use(`api/${version}/todo`, todoRouter.default)
        .use('*', (_, res) => res.status(404).json({message: "Page not found"}))
).listen(port, () => console.log(`Server started on port ${port}`))

process.on('SIGINT', () => {
    server.close();
    process.exit(-1);
})
