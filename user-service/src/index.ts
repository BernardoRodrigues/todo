
import { config } from 'dotenv';
import { join, resolve } from 'path'
console.log(resolve(__dirname, '..', '..', 'environments', `${process.env.NODE_ENV}.env`))
config(
    {
        path: resolve(__dirname, '..', '..', 'environments', `${process.env.NODE_ENV}.env`)
    }
)
import { readFileSync } from 'fs';
import express from 'express'
import logger from 'morgan'
// import { version } from '../package.json'
import { json } from 'body-parser'
import { createServer } from 'https'
import userRouter from './routes/user-routes'

import { initialize, use } from 'passport';

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'


use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: readFileSync(join(__dirname, 'cert', 'server-key.pem'))
    },
    (payload, done) => {
        console.log(`Jwt Payload: ${payload}`)
        console.table(payload)
        return done(null, {user: true});
    })
)
// console.log(resolve('environments', `${process.env.NODE_ENV}.env`))
// console.log("ENV: ", process.env)
const app = express();
const version = `v${require('./../../package.json').version.split('.')[0]}`
console.log(`Api version: ${version}`);
const port = process.env.PORT || 3000;
const server = createServer(
    {
        cert: readFileSync(join(__dirname, 'cert', 'user-service.crt')),
        key: readFileSync(join(__dirname, 'cert', 'user-service.key'))
    },
    app
        .use(logger('dev'))
        .use(initialize())
        .use(json())
        // .use(cors)
        .use(`/service/user`, userRouter)
        .use('*', (_, res) => res.status(404).json({message: 'Page not found'}))
    )
    .listen(port, () => console.log(`Server started on port ${port} with version ${version}`))
process.on('SIGINT', () => { 
    server.close();
    process.exit(-1);
});
    

