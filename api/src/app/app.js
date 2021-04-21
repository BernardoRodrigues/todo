
'use strict'
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config()
} 

const express = require('express')
// const passport = require('passport')
// const functions = require('firebase-functions')
// const admin = require('firebase-admin')
// const fapp = admin.initializeApp()
// functions.database.ref()
//     .onCreate(async (snapshot, context) => {
//         const value = snapshot.val()
//         const date = new Date(value.startDate)
//         fapp
// })



const morgan = require('morgan')
// const userController =  ('./controllers/user.controller';
// import https from 'https';
const https = require('https')
// const fs = require('fs/promises')
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt
const fs = require('fs')

const app = express()
app.use(morgan('common'))
const { DbConfig } = require('./db/db-config')
const db  = require('./db/db-config').default.default('postgres://postgres:postgres@localhost:5432/todo_db')
const userRep = require('./db/user.repository')(10, db)
try {
    // TODO fix
    // const secretJson = JSON.parse(fs.readFileSync('./file-utils/secret.json').toString())
    const secretJson = {secret: 'blah_blah_blah'}
    // passport.use(new JwtStrategy({
    //     secretOrKey: secretJson.secret,
    //     ignoreExpiration: true,
    //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    // }, async (payload, done) => {
    //     const user = await userRep.findUser(payload.userId);
    //     if (user == null || Object.values(user).length === 0) {
    //         //TODO add error
    //         return done({message: 'error'}, null)
    //     }
    //     return done(null, user)
    // }))
} catch(err) {
    console.error(err)
    process.exit(-1)
}

app.use(express.json())
const pkg = require('./../../package.json');
const http = require('http');
const passport = require('passport')
const version = `v${pkg.version.toString().split('.')[0]}`
console.log(`Api Version: ${version}`);
//postgres://user:secret@localhost:5432/todo_db
const todoRep = require('./db/todo.repository')(db)

// const todoRep = new TodoRepository(db);

const todoService = require('./services/todo.service')(todoRep)
const todos = require('./routes/todo.route')(todoService)
const users = require('./routes/user.route')(userRep)

// const publicPaths = [
//     `/api/${version}/user/login`,
//     `/api/${version}/user/signup`,
//     // `user/login`,
//     // `user/signup`,
// ]


// function checkToken(req, res, next) {
//     console.log(`Base URl: ${req.baseUrl}`)
//     if (publicPaths.includes(req.baseUrl)) {
//         console.log("1")
//         return next();
//     }
//     const auth = req.headers.authorization
//     if (auth == null || auth === '') {
//         console.log("2")
//         return res.status(403).json({message: "Unauthorized"})
//     }
//     console.log("3")
//     return next();
// }

// app.use('*', checkToken)

app.use(`/api/${version}/todo`, passport.authenticate('jwt', {session: false}),todos);
app.use(`/api/${version}/user`, users);
app.use('*', (_, res) => res.status(404))
// console.table(app._router.stack);
// console.log(app._router.stack);
// const options = {
//     key:  await fs.readFile(''),
//     cert: await fs.readFile('')
// }
// app.get('/', (req, res) => res.status(200).json({message: 'hi'}))

// console.table(args);

const port = process.env.PORT || 2000
console.log(port)
const server = http
    .createServer(app)
    .listen(port, () => console.log(`Server started on port ${port}`));
process.on('SIGTERM', () => {
    console.log("Server shutting down...")
    server.close();
})

