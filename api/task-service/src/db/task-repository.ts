import { TaskModel } from './../models/task-model';
import { DbConnection } from "./db-connection";
import { request } from 'https'
import { TodoModel } from '../models/todo-model';

export class TaskRepository {

    constructor(private db: DbConnection) {}

    private mapper(res: {endpoint: string, p256dh: string, auth: string, userId: string, todoId: string, startDate: string | Date, endDate: string | Date, title: string, priorityId: number, priorityValue: string})
    : {task: TaskModel, todo: TodoModel} {
        return {
            task: {
                endpoint: res.endpoint,
                userId: res.userId,
                pd256dh: res.p256dh,
                auth: res.auth
            },
            todo: {
                id: res.todoId,
                startDate: new Date(res.startDate),
                endDate: new Date(res.endDate),
                title: res.title,
                priority: {
                    value: res.priorityId,
                    name: res.priorityValue
                }
            }
        };
    }

    public async getBetweenDates(startDate: Date, endDate: Date): Promise<{task: TaskModel, todo: TodoModel}[]> {
        try {
            const { rows } = await this.db.query(
                `select tt.endpoint as endpoint, tt.auth_key as auth, tt.p256dh_key as p256dh, td.todo_start_date as startDate, td.todo_end_date as endDate, td.id as todoId, 
                td.title as title, p.priority_id as priorityId, p.priority_value as priorityValue, tt.user_id as userId
                from to_do as td 
                inner join priority as p on p.priority_id = td.priority_id 
                inner join todo_task as tt on tt.user_id = tt.user_id 
                where td.todo_start_date > $1 and td.todo_end_date < $2 and td.is_done = true and td.is_cancelled = false;`,
                [startDate, endDate]
            )
            return rows.map(this.mapper)
        } catch(err) {
            console.error(err);
            //TODO throw custom error
            throw err;
        }
    }

    public async subscribe(task: TaskModel): Promise<any> {
        try {
            const { rows } = await this.db.query(
                "insert into todo_task(endpoint, user_id) values ($1, $2) on conflict do nothing",
                [task.endpoint, task.userId]
            )
            return rows[0]
        } catch(err) {
            console.error(err)
            throw err;
        }
    }

    public async unsubscribe(endpoint: string): Promise<any> {
        try {
            const { rows } = await this.db.query(
                "delete from todo_task where endpoint = $1",
                [endpoint]
            )
            return rows[0]
        } catch(err) {
            console.error(err)
            throw err;
        }
    }

}