const db = require('../db_connection')

const Post = () => {
    
    const getPostsByEvent = async event_id => {
        return await db.any(`select * from posts where event_id = ${event_id}`)
    }

    const addPost = async (image,text,username,event_id) => {
        console.log('10')
        return await db.any(`insert into posts (picurl,body,username,event_id) values ('${image}','${text}','${username}',${event_id})`)
    }
    
    return {
        getPostsByEvent,
        addPost
    }
}

module.exports = Post