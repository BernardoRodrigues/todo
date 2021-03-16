
async function getAllOnDate(db, date) {
    try {
        // const { rows } = await db.query(`
        // select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
        // p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
        // from to_do as td 
        // inner join priority as p on (td.priority_id = p.priority_id) 
        // where todo_start_date < $1 and todo_end_date > $1`, date)
        return getBetweenDates(db, date, date)
    } catch(err) {
        console.error(err)
        //TODO create custom error
        throw new Error('')
    }
}

async function getBetweenDates(db, startDate, endDate) {
    try {
        const { rows } = await db.query(
            `select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
            startDate   p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
            from to_do as td 
            inner join priority as p on (td.priority_id = p.priority_id)   
            where td.todo_start_date < $1 and td.todo_end_date > $2 `,
            [startDate, endDate]
        )
        return rows;
    } catch(err) {
        console.error(err)
    }
}

async function getAll(db) {
    try {
        const { rows } = await db.query(
            `select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
            p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
            from to_do as td 
            inner join priority as p on (td.priority_id = p.priority_id)`
            )
        return rows;
    } catch(err) {
        console.error(err);
    }
}

async function getById(db, id) {
    try {
        const { rows } = await db.query(
            `select todo_id as id, user_id as userId, todo_start_date as startDate, todo_end_date as endDate, value, 
            p.priority_id as priorityValue, p.priority_value as priorityName, td.is_done as isDone, td.is_cancelled as isCancelled 
            from to_do as td 
            inner join priority as p on (td.priority_id = p.priority_id) 
            where todo_id = $1`, id)
        return rows;
    } catch(err) {
        console.error(err);
    }
}

async function create(db, {userId, startDate, endDate, value, priority}) {
    const values = [
        userId,
        typeof startDate === 'string' ? 
            new Date(startDate) : startDate, 
        typeof model.endDate === 'string' ? 
            new Date(endDate) : endDate, 
        value, 
        priority]
    try {
        const { rows } = await db.query(
            `insert into to_do(user_id, todo_start_date, todo_end_date, value, priority_id) 
        values ($1, $2, $3, $4, $5) returning todo_id as id`, values)
        return rows[0];
    } catch(err) {
        //TODO add custom errors
        console.error(err);
    }
}

async function updateTodoValues(db, {id, userId, startDate, endDate, value, priority}) {
    const values = [
        userId,
        typeof startDate === 'string' ? 
            new Date(startDate) : startDate, 
        typeof endDate === 'string' ? 
            new Date(endDate) : endDate, 
        value, 
        priority,
        id
    ]
    try {
        const { rows } = await db.query(
            `update to_do 
            set user_id = $1, todo_start_date = $2, todo_end_date = $3, value = $4, priority_id = $5 
            where todo_id = $6`, values)
        return rows[0];
    } catch(err) {
        //TODO add custom> errors
        console.error(err);
    }
}

async function erase(db, id) {
    try {
        const { rows } = await db.query("select * from to_do")
        return rows;
    } catch(err) {
        console.error(err);
    }
}

async function updateDoneStatus(db, {id, isDone}) {
    try {
        const { rows } = await db.query(
            `update to_do 
            set is_done = $1 
            where todo_id = $2`,
            [isDone, id]
        )
        return rows;
    } catch(err) {
        console.error(err);
    }
}

async function cancelTodo(db, {id, isCancelled}) {
    try {
        const { rows } = await db.query(
            `update to_do 
            set is_cancelled = $1 
            where todo_id = $2`,
            [isCancelled, id]
        )
        return rows;
    } catch(err) {
        console.error(err);
    }
}

module.exports = (db) => {
    return {
        getAll: () => getAll(db),
        getById: (id) => getById(db, id),
        getBetweenDates: (startDate, endDate) => getBetweenDates(db, startDate, endDate),
        create: (model) => create(db, model),
        erase: (id) => erase(db, id),
        updateTodoValues: (model) => updateTodoValues(db, model),
        updateDoneStatus: (partialModel) =>  updateDoneStatus(db, partialModel),
        cancelTodo: (partialModel) => cancelTodo(db, partialModel)
    }
}