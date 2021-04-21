import { TodoModel } from "../models/todo-model";
import {
    DbConnection
} from "./db-connection";

export class TodoRepository {

    constructor(private db: DbConnection) {}

    private mapper(v: any): TodoModel {
        return {
            id: v.id,
            userId: v.userid,
            startDate: v.startdate,
            endDate: v.enddate,
            value: v.value,
            priority: {
                value: v.priorityvalue,
                name: v.priorityname
            },
            isDone: v.isdone,
            isCancelled: v.iscancelled
        };
    }

    public async getAllByUserId(userId: string): Promise<TodoModel[]> {
        try {
            const { rows } = await this.db.query(
                `select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
                p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
                from to_do as td 
                inner join priority as p on (td.priority_id = p.priority_id) 
                where user_id = $1`,
                userId
            );
            return rows.map(this.mapper);
        } catch(err) {
            console.error(err);
            throw err;
        }
    }

    public getAllOnDate(date: Date | string) {
        try {
            // const { rows } = await db.query(`
            // select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
            // p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
            // from to_do as td 
            // inner join priority as p on (td.priority_id = p.priority_id) 
            // where todo_start_date < $1 and todo_end_date > $1`, date)
            return this.getBetweenDates(date, date)
        } catch (err) {
            console.error(err)
            //TODO create custom error
            throw new Error('')
        }
    }

    public async getBetweenDates(startDate: Date | string, endDate: Date | string): Promise <TodoModel[]> {
        try {
            const {
                rows
            } = await this.db.query(
                `select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
                        startDate p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
                        from to_do as td 
                        inner join priority as p on (td.priority_id = p.priority_id)   
                        where td.todo_start_date < $1 and td.todo_end_date > $2 `,
                [startDate, endDate]
            )
            return rows.map(this.mapper);
        } catch (err) {
            console.error(err)
            throw err;
        }
    }

    public async getAll(): Promise <TodoModel[]> {
        try {
            const {
                rows
            } = await this.db.query(
                `select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
                        p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
                        from to_do as td 
                        inner join priority as p on (td.priority_id = p.priority_id)`
            )
            return rows.map(this.mapper);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async getById(id: string): Promise<TodoModel> {
        try {
            const {
                rows
            } = await this.db.query(
                `select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
                        p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
                        from to_do as td 
                        inner join priority as p on (td.priority_id = p.priority_id) 
                        where todo_id = $1`, id)
            return rows[0] as TodoModel;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async create({
        userId,
        startDate,
        endDate,
        value,
        priority
    }: {
        userId: string,
        startDate: Date | string,
        endDate: Date | string,
        value: string,
        priority: number
    }): Promise <{id: string}> {
        const values = [
            userId,
            new Date(startDate),
            new Date(endDate),
            value,
            priority
        ]
        try {
            const {
                rows
            } = await this.db.query(
                `insert into to_do(user_id, todo_start_date, todo_end_date, value, priority_id) 
                    values ($1, $2, $3, $4, $5) returning todo_id as id`, values)
            return rows[0];
        } catch (err) {
            //TODO add custom errors
            console.error(err);
            throw err;
        }
    }

    public async updateTodoValues({
        id,
        userId,
        startDate,
        endDate,
        value,
        priority
    }: {
        id: string,
        userId: string,
        startDate: Date | string,
        endDate: Date | string,
        value: string,
        priority: number
    }): Promise <any> {
        const values = [
            userId,
            new Date(startDate),
            new Date(endDate),
            value,
            priority,
            id
        ]
        try {
            const {
                rows
            } = await this.db.query(
                `update to_do 
                        set user_id = $1, todo_start_date = $2, todo_end_date = $3, value = $4, priority_id = $5 
                        where todo_id = $6`, values)
            return rows[0];
        } catch (err) {
            //TODO add custom> errors
            console.error(err);
            throw err;
        }
    }

    public async erase(id: string): Promise <any> {
        try {
            const {
                rows
            } = await this.db.query("select * from to_do")
            return rows;
        } catch (err) {
            console.error(err);
        }
    }

    public async updateDoneStatus({
        id,
        isDone
    }: {
        id: string,
        isDone: boolean
    }): Promise <any> {
        try {
            const {
                rows
            } = await this.db.query(
                `update to_do 
                        set is_done = $1 
                        where todo_id = $2`,
                [isDone, id]
            )
            return rows;
        } catch (err) {
            console.error(err);
        }
    }

    public async cancelTodo({
        id,
        isCancelled
    }: {
        id: string,
        isCancelled: boolean
    }): Promise <any> {
        try {
            const {
                rows
            } = await this.db.query(
                `update to_do 
                        set is_cancelled = $1 
                        where todo_id = $2`,
                [isCancelled, id]
            )
            return rows;
        } catch (err) {
            console.error(err);
        }
    }

}