import { TaskModel } from "../models/task-model";
import { DbConnection } from "./db-connection";

export class TaskRepository {

    constructor(private db: DbConnection) {}

    public mapper(value: any): TaskModel {
        return {

        }
    }

    public async getBetweenDates(startDate: Date, endDate: Date): Promise<TaskModel[]> {
        try {
            const { rows } = await this.db.query(
                "select * from user_tasks where todo_start_date > $1 and todo_end_date < $2 and isDone = true and isCancelled = false;",
                [startDate, endDate]
            )
            return rows.map(this.mapper)
        } catch(err) {
            console.error(err);
            //TODO throw custom error
            throw err;
        }
    }

}