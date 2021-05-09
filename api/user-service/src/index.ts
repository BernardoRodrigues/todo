
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config()
}
import express from 'express'
import logger from 'morgan'
// import { version } from '../package.json'
import { json } from 'body-parser'
import { createServer as httpCreateServer } from 'http';
import { createServer as httpsCreateServer } from 'https'
import userRouter from './routes/user-routes'

const createServer = process.env.NODE_ENV === 'production' ? httpsCreateServer : httpCreateServer;
const app = express();
const version = `v${require('./../../package.json').version.split('.')[0]}`
console.log(`Api version: ${version}`);
const port = process.env.PORT || 3000;
const server = createServer(
    app.use(logger('dev'))
        .use(json())
        .use(cors())
        .use(`/api/${version}/user`, userRouter)
        .use('*', (_, res) => res.status(404).json({message: 'Page not found'}))
    )
    .listen(port, () => console.log(`Server started on port ${port} with version ${version}`))
process.on('SIGINT', () => { 
    server.close();
    process.exit(-1);
});
    

