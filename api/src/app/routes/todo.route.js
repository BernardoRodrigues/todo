const express = require('express')

const router = express.Router()
    // TODO CHECK ERROR
function getAll(todoService, res) {
    try {
        const result = todoService.getAll()
        res.status(200).send(result)
    } catch(err) {
        res.status(400).send(err)
    }
}

async function getById(todoService, id, res) {
    try {
        const result = await todoService.getById(id)
        res.status(200).send(result)
    } catch(err) {
        res.status(400).send(err)
    }
}




module.exports = function(todoService) {
    router.get('/', (req, res, next) => getAll(todoService, res))

    router.get('/:id', (req, res, next) => getById(todoService, req.params.id, res)),

    router.post('/', (req, res) => {
        try {
            const model = {
                userId: req.cookies.userId,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                value: req.body.value,
                priority: req.body.priority
            }
            const result = todoService.create(model)
            res.status(201).json({...model, ...result});
        } catch(err) {
            //TODO check what error it is
            res.status(400).json({message: 'something'})
        }
        
    })

    router.put('/:id/done', (req, res) => {
        try {
            req.cookies.userId
            const id = req.params.id
            const done = req.body.done
            // TODO implement method for done todo's
            //todoService
            res.status(200).json({});
        } catch(err) {
            
        }
    })
    
    return router;
}
