import { DbConfig } from './models/db-config';
import { DbConnection } from './db/db-connection';
import { TaskRepository } from './db/task-repository';
import express from 'express'
import logger from 'morgan'
import { scheduleJob, RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit, Range } from 'node-schedule'
import { sendNotification, PushSubscription } from 'web-push'

if (process.env.NODE_ENV === 'production') {
    require('dotenv').config()
}

if (process.env.GRANULARITY == null || process.env.GRANULARITY === '') {
    throw new Error('GRANULARITY cant be empty')
}
//nn-format
// -h > 24
// 

const config: DbConfig = {

}
const connection = new DbConnection(config);
const taskRep = new TaskRepository(connection)
const granularity = +process.env.GRANULARITY
const job = scheduleJob("database check", "0 * * * *", async (fireDate: Date) => {
    const startDate = new Date(fireDate);
    const endDate = new Date(startDate)
    //add granularity
    // endDate.
    const tasks = await taskRep.getBetweenDates(startDate, endDate);
    for(const task of tasks) {
        const subscription: PushSubscription = {
            endpoint: "",
            keys: {
                p256dh: "",
                auth: ""
            }
        }
        const result = await sendNotification(subscription);
    }
})

const app = express()
const server app.use(logger('dev'))
    .




