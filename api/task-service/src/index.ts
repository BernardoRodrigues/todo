import { DbConfig } from './models/db-config';
import { DbConnection } from './db/db-connection';
import { TaskRepository } from './db/task-repository';
import express from 'express'
import logger from 'morgan'
import { scheduleJob, RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit, Range } from 'node-schedule'
import { sendNotification, PushSubscription, setVapidDetails } from 'web-push'
import { createServer as httpsCreateServer } from 'https'
// import { createServer as httpCreateServer } from 'http'
import cors from 'cors';
import { json } from 'body-parser';
import taskRouter from './routes/task-routes'
import * as fs from 'fs'
import { NotificationModel } from './models/notification-model';

if (process.env.NODE_ENV === 'production') {
    require('dotenv').config()
}

if (process.env.GRANULARITY == null || process.env.GRANULARITY === '') {
    throw new Error('GRANULARITY cant be empty')
}
//nn-format
// -h > 24
// 
const createServer = process.env.NODE_ENV === 'production' ? httpsCreateServer : httpsCreateServer;
const config: DbConfig = {
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    port: process.env.DB_PORT == null ? 5432 : +process.env.DB_PORT,
    database: process.env.DB_NAME || "todo_db",
    host: process.env.DB_HOST || "localhost"
}

const keys: {private: string, public: string} = JSON.parse(fs.readFileSync("./files/keys.json").toString())
setVapidDetails(
    `mailto:${process.env.VAPID_MAIL || "bernardo.qtr.21@gmail.com"}`,
    keys.public,
    keys.private
)

const connection = new DbConnection(config);
const taskRep = new TaskRepository(connection)
const granularity = +process.env.GRANULARITY
// TODO add formating for granularity
const job = scheduleJob("database check", "0 * * * *", async (fireDate: Date) => {
    const startDate = new Date(fireDate);
    const endDate = new Date(startDate)
    //add granularity
    // endDate.
    const results = await taskRep.getBetweenDates(startDate, endDate);
    for(const res of results) {
        const subscription: PushSubscription = {
            endpoint: res.task.endpoint,
            keys: {
                p256dh: res.task.pd256dh,
                auth: res.task.auth
            }
        }
        const notification: NotificationModel = {...res.todo, priorityName: res.todo.priority.name, priorityValue: res.todo.priority.value}
        try  {
            const result = await sendNotification(subscription, JSON.stringify(notification));
            const code = result.statusCode;
            switch (code) {
                case 201:
                    //TODO update the subscription on the database so it has the last time the user was notified
                    break;
                case 410:
                case 404:
                    //TODO update the subscription on the database so it has the information that the user has been unsubscribed
                    await taskRep.unsubscribe(res.task.endpoint)
                    break;   
            }
        } catch(err) {
            console.error(err);
        }
    }
})
const port = process.env.PORT || 4330
const version = `v${require('./../../package.json').version.split('.')[0]}`
const app = express()
const server = createServer({
    cert: fs.readFileSync('./cert/server-certificate.pem'),
    key: fs.readFileSync('./cert/server-key.pem')
},
    app.use(logger('dev'))
        .use(json())
        .use(cors()) 
        .use(`/api/${version}/task`, taskRouter)
        .use('*', (_, res) => res.status(404).json({message: "Not Found"}))
)
.listen(port, () => {console.log(`Server started on port ${port}`)})

process.on("SIGINT", () => {
    const res = job.cancel(false);  
    server.close();
})




