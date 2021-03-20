const express = require('express')
const passport = require('passport')
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
const https = require('http');
// const fs = require('fs/promises')
const minimist = require('minimist')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const fs = require('fs');

const app = express()
app.use(morgan('common'))
const db  = require('./db/index')('postgres://postgres:postgres@localhost:5432/todo_db')
const userRep = require('./db/user.repository')(10, db)
try {
    // TODO fix
    // const secretJson = JSON.parse(fs.readFileSync('./file-utils/secret.json').toString())
    const secretJson = {secret: 'blah_blah_blah'}
    passport.use(new JwtStrategy({
        secretOrKey: secretJson.secret,
        ignoreExpiration: true,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload, done) => {
        const user = await userRep.findUser(payload.email);
        if (user == null || Object.values(user).length === 0) {
            //TODO add error
            return done({message: 'error'}, null)
        }
        return done(null, user)
    }))
} catch(err) {
    console.error(err)
    process.exit(-1)
}

// passport.serializeUser((user, done) => {
//     if ()
// })
app.use(require('cookie-parser')());
app.use(express.json())
app.use(passport.initialize());
//postgres://user:secret@localhost:5432/todo_db
const todoRep = require('./db/todo.repository')(db)
const todoService = require('./services/todo.service')(todoRep)
const todos = require('./routes/todo.route')(todoService)
const users = require('./routes/user.route')(userRep)

const publicPaths = [
    '/user/login',
]

function checkToken(req, res, next) {
    if (publicPaths.includes(req.path)) {
        return next();
    }
    const auth = req.headers.authorization
    if (auth == null || auth === '') {
        return res.status(403)
    }
    next();
}

app.all('*', checkToken)
app.use('/todo', todos)
app.use('/user', users)
app.use('*', (_, res) => res.status(404))

// const options = {
//     key:  await fs.readFile(''),
//     cert: await fs.readFile('')
// }
// app.get('/', (req, res) => res.status(200).json({message: 'hi'}))

const args = minimist(process.argv.slice(2))
console.log("Arguments: ", args);
// console.table(args);
const port = process.env.PORT || 3000
console.log(port)
const server = https.createServer(app).listen(port, () => console.log(`started on port ${port}`))

