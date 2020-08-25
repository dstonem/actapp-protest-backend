const db = require('../db_connection')

const Post = () => {
    
    const getPostsByEvent = event_id => {
        return db.any(`select * from posts where event_id = ${event_id}`)
    }
    
    return {
        getPostsByEvent
    }
}

module.exports = Post