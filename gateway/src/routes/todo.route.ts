import axios from "axios";
import { Router } from "express";
import { Agent } from "https";
import { areParametersValid, getAxiosAuthConfig, getAxiosBaseUrl } from "../utils/route-utils";

const instance = axios.create(
    {httpsAgent: new Agent({rejectUnauthorized: false}), proxy: false}
    )
const todoRouter = Router()
    .get("/", async (req, res) => {
        try {
            console.log(req.headers)
            const options = getAxiosAuthConfig(req.headers.authorization)
            const result = await instance.get(`${process.env.BASE_TODO_URL}`, options)
            return res.status(result.status).json(result.data);
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: "Server error"})
        }
    })
    .post("/", async (req, res) => {
        try {
            const { startDate, endDate, title, priority } = req.body;
            if (!areParametersValid(startDate, endDate, title, priority)) {
                return res.status(400).json({message: "Parameters are not valid"})
            }
            const options = getAxiosAuthConfig(req.headers.authorization)
            const result = await instance.post(`${process.env.BASE_TODO_URL}`, {startDate: startDate, endDate: endDate, title: title, priority: priority}, options)
            return res.status(result.status).json(result.data);
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: "Server error"})
        }
    })
    .put("/:id", async (req, res) => {
        try {
            const { startDate, endDate, title, priority } = req.body;
            const options = getAxiosAuthConfig(req.headers.authorization)
            const result = await instance.put(`${process.env.BASE_TODO_URL}/${req.params.id}`, {startDate: startDate, endDate: endDate, title: title, priority: priority}, options)
            return res.status(result.status).json(result.data);
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: "Server error"})
        }
    })
    .put("/:id/status", async (req, res) => {
        try {
            const { is_done } = req.body;
            if (!areParametersValid(is_done)) {
                return res.status(400).json({message: "is_done is not valid"})
            }
            const options = getAxiosAuthConfig(req.headers.authorization)
            const result = await instance.put(`${process.env.BASE_TODO_URL}/${req.params.id}/status`, {isDone: is_done}, options)
            return res.status(result.status).json(result.data);
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: "Server error"})
        }
    })
    .put("/:id/cancel", async (req, res) => {
        try {
            const { is_cancelled } = req.body;
            if (!areParametersValid(is_cancelled)) {
                return res.status(400).json({message: "is_cancelled is not valid"})
            }
            const options = getAxiosAuthConfig(req.headers.authorization)
            const result = await instance.put(`${process.env.BASE_TODO_URL}/${req.params.id}/cancel`, {isCancelled: is_cancelled}, options)
            return res.status(result.status).json(result.data);
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: "Server error"})
        }
    })


export { todoRouter }