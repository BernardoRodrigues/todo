const cookieParser = require('cookie-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const fs = require('fs');
const secret = 'blah blah blah';
const { UserRepository } = require('./../db/user.repository')
const userRepository = new UserRepository({})
// JSON.parse(fs.readFileSync('./../file-utils/secret.json').toString()).secret
function getUser({email, password, firstName, lastName}) {
    if (email == null || email === '') {
        throw new Error('email cannot be empty')
    }
    if (password == null || password === '') {
        throw new Error('password cannot be empty')
    }
    if (firstName == null || firstName === '') {
        throw new Error('firstName cannot be empty')
    }
    if (lastName == null || lastName === '') {
        throw new Error('lastName cannot be empty')
    }
    return {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    }
}

const router = express.Router()

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userRepository.login(email, password);
        if (user == null) {
            return res.status(400).json({message: 'bad login'})
        }
        const token = jwt.sign({ id: user.id }, secret, {algorithm: 'HS256', noTimestamp: true})
        passport.authenticate('jwt', {session: false}, () => {
        });
        return res.status(200).json({token: token})
    } catch(err) {
        console.warn("todo")
        return res.status(400).send({message: 'permissions'})
        //TODO warn of bad login
    }
})

//TODO add audience, issue, certificate, etc
//TODO validate if I need this route
router.get('/validate',(req, res) => {
    try {
        const value = jwt.verify(token, secret, {algorithms: 'HS256'}).id
        return res.status(200).json({id: value});
    } catch (err) {
        return res.status(400)
    }
})

router.post('/signup', async (req, res) => {
    try {
        console.log(req.body)
        let aux = getUser(req.body)
        console.log('User: ', aux)
        const id = await userRepository.signup(aux)
        // delete aux[password];
        user = {...aux, ...id}
        const token = jwt.sign({ id: user.id }, secret, {algorithm: 'HS256', noTimestamp: true})
        passport.authenticate('jwt', {session: false}, () => {
        });
        return res.status(201).json({token: token})
    } catch(err) {
        return res.status(400).json(err.message)
    }
})

router.delete('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.decode(token).id
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

router.get('/logout', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.removeHeader('Authorization')
    res.status(200).json({});
})

export default router
// module.exports = router