const db = require('../db_connection')

const User = () => {
    const getUsers = async (username) => {
        return db.one(`select * from users where id = '${username}'`)
    }

    return {
        getUsers
    }
}

module.exports = User