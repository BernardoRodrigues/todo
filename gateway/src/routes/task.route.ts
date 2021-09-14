import { BaseError } from './../errors/base.error';
import { response, Router } from "express";
import { areParametersValid, getAxiosAuthConfig, getAxiosBaseUrl } from '../utils/route-utils';
import axios from 'axios';
import { Agent } from 'https';


const instance = axios.create(
    {httpsAgent: new Agent({rejectUnauthorized: false}), proxy: false}
    )
const taskRouter = Router()
    .post("/subscribe", async (req, res) => {
        try {
            const { endpoint,   p256dh, auth } = req.body;
            if (!areParametersValid(endpoint, p256dh, auth)) {
                return res.status(400).json({message: "Parameters are not valid"})
            }
            const options = getAxiosAuthConfig(req.headers.authorization);
            const result = await instance.post(`${process.env.BASE_TASK_URL}/subscribe`, {endpoint: endpoint, p256dh: p256dh, auth: auth}, options)
            return res.status(result.status).json(result.data)
        } catch(err) {
            console.error(err)
            if (err instanceof BaseError) {
                return res.status(err.code).json(err.message)
            }
            return res.status(500).json({message: "Server error"})
        }
    })
    .post("/unsubscribe", async (req, res) => {
        try {
            const { endpoint } = req.body;
            if (!areParametersValid(endpoint)) {
                return res.status(400).json({message: "Parameters are not valid"})
            }
            const options = getAxiosAuthConfig(req.headers.authorization);
            const result = await instance.post(`${process.env.BASE_TASK_URL}/unsusbscribe`, {endpoint: endpoint}, options)
            return res.status(result.status).json(result.data)
        } catch(err) {
            console.error(err)
            if (err instanceof BaseError) {
                return res.status(err.code).json(err.message)
            }
            return res.status(500).json({message: "Server error"})
        }
    })

export { taskRouter }