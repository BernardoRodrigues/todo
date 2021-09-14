import { BaseError } from './../errors/base.error';
import { InvalidCredentialsError } from './../errors/invalid-credentials.error';
import { Router } from "express";
import axios from "axios";
import { AxiosRequestConfig } from 'axios';
import { Agent } from 'https';
import { areParametersValid, getAxiosAuthConfig, getAxiosBaseUrl } from '../utils/route-utils';

const instance = axios.create(
    {httpsAgent: new Agent({rejectUnauthorized: false}), proxy: false}
    )
const userRouter = Router()
    .post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!areParametersValid(email, password)) {
                throw new InvalidCredentialsError("Credentials cannot be empty", 400)
            }
            const result = await instance.post(`${process.env.BASE_USER_URL}/login`, {email: email, password: password});
            return res.status(result.status).json(result.data)
        } catch (err) {
            console.error(err);
            if (err instanceof BaseError) {
                return res.status(err.code).json(err.message)
            }
            // assume we failed
            return res.status(500).json({message: "Server error"})
        }
    })
    .delete('/', async (req, res) => {
        try {
            const options = getAxiosAuthConfig(req.headers.authorization)
            const result = await instance.delete(`${process.env.BASE_USER_URL}/`, options)
            return res.status(result.status).json(result.data)
        } catch(err) {
            console.error(err);
            if (err instanceof BaseError) {
                return res.status(err.code).json(err.message)
            }
            // assume we failed
            return res.status(500).json({message: "Server error"})
        }
    })
    .post("/signup", async (req, res) => {
        try {
            const { email, password, firstName, lastName } = req.body;
            if (!areParametersValid(email, password, firstName, lastName)) {
                return res.status(400).json()
            }

            console.log("User signup")
            const result = await instance.post(`${process.env.BASE_USER_URL}/signup`, {email: email, password: password, firstName: firstName, lastName: lastName})
            return res.status(result.status).json(result.data)
        } catch(err) {
            console.error(err)
            if (err instanceof BaseError) {
                return res.status(err.code).json(err.message)
            }
            // assume we failed
            return res.status(500).json({message: "Server error"})
        }
    })
    .get("/logout", async (req, res) => {
        try {
            const options = getAxiosAuthConfig(req.headers.authorization);
            const result = await instance.get(`${process.env.BASE_USER_URL}/logout`, options)
            return res.status(result.status).json({message: "user logged out"})
        } catch(err) {
            if (err instanceof BaseError) {
                return res.status(err.code).json(err.message)
            }
            // assume we failed
            return res.status(500).json({message: "Server error"})
        }
    })
    

export { userRouter }


