const db = require('../db_connection')

const Actions = () => {

    const getAllActions = async () => {
        return await db.any('select * from actions')
    }

    return {
        getAllActions
    }
}

module.exports = Actions