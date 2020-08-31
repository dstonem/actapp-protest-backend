const db = require('../db_connection')

const Post = () => {
    
    const getPostsByEvent = async event_id => {
        return await db.any(`select * from posts where event_id = ${event_id}`)
    }
    
    return {
        getPostsByEvent
    }
}

module.exports = Post