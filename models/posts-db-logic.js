const db = require('../db_connection')

const Post = () => {
    
    const getPostsByEvent = async event_id => {
        return await db.any(`select * from posts where event_id = ${event_id}`)
    }

    const addPost = async (image,text,username,event_id) => {
        return await db.any(`insert into posts (picurl,body,username,event_id) values ('${image}','${text}','${username}',${event_id})`)
    }

    const getCommentsByPost = async post_id => {
        return await db.any(`select * from comments where post_id = ${post_id}`)
    }

    const addComment = async (comment,user_id,username,post_id) => {
        return await db.any(`insert into comments (comment,user_id,username,post_id) values ('${comment}','${user_id}','${username}',${post_id})`)
    }

    const getLikesByPost = async post_id => {
        return await db.one(`select count(*) from likes where post_id = ${post_id}`)
    }

    const checkIfUserAlreadyLikedPost = async (user_id,post_id)=> {
        let getLikes = await db.one(`select (user_id) from likes where post_id = ${post_id}`)
        console.log(getLikes.user_id,user_id)
        let alreadyLikes = false
        if(getLikes.user_id === user_id){
            alreadyLikes = true
        }
        console.log(alreadyLikes,'30')
        return alreadyLikes
    }

    const addLike = async (user_id,post_id) => {
        let alreadyLikes = await checkIfUserAlreadyLikedPost(user_id,post_id)
        console.log(alreadyLikes,'38')
        if(!alreadyLikes) {
            return await db.none(`insert into likes (user_id,post_id) values (${user_id},${post_id})`)
        }
        return false
    }
    
    return {
        getPostsByEvent,
        addPost,
        getCommentsByPost,
        addComment,
        getLikesByPost,
        addLike,
        checkIfUserAlreadyLikedPost
    }
}

module.exports = Post

// const storeImageBinary = async (imageName,img) => {
//     return await db.any(`File file = new File('${imageName}');
//     FileInputStream fis = new FileInputStream(file);
//     PreparedStatement ps = conn.prepareStatement('INSERT INTO images VALUES (${imageName}, ${img})');
//     ps.setString(1, file.getName());
//     ps.setBinaryStream(2, fis, file.length());
//     ps.executeUpdate();
//     ps.close();
//     fis.close();`)
// }