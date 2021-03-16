const cookieParser = require('cookie-parser')
const express = require('express')
const passport = require('passport');
// const passport = require('passport-jwt')

const router = express.Router()

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

module.exports = userRepository => {

    router.post('/login', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        try {
            const user = await userRepository.login(email, password);
            res.status(200).json(user)
        } catch(err) {
            res.status(400).send({message: 'permissions'})
            //TODO warn of bad login
            console.warn("todo")
        }
    })

    router.post('/signup', async (req, res) => {
        try {
            console.log(req.body)
            let user = getUser(req.body)
            console.log('User: ', user)
            user = await userRepository.signup(user)
            res.status(201).json(user)
        } catch(err) {
            res.status(400).json(err.message)
        }
    })

    return router
}