
function getAll(todoRepository) {
    return todoRepository.getAll();
}

function getById(todoRepository, id) {

}

function update(todoRepository, todoModel) {

}

function erase(todoRepository, id) {

}

function create(todoRepository, todoModel) {
    try {
        return todoRepository.create(todoModel);
    } catch(err) {
        console.error(err);
    }
}

module.exports = function(todoRepository) {
    return {
        getAll: () => getAll(todoRepository),
        getById: (id) => getById(todoRepository, id),
        update: (todoModel) => update(todoRepository, todoModel),
        erase: (id) => erase(todoRepository, id),
        create: (todoModel) => create(todoRepository, todoModel)
    }
}