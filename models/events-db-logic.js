const db = require('../db_connection')

const Event = () => {

    const getAllEvents = async () => {
        return db.any('select * from events')
    }

    return {
        getAllEvents
    }
}

module.exports = Event