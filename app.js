const express = require('express')
const app = express()
const cors = require('cors')
const {secret} = require('./config')
const port = 3456
const session = require('express-session')
const eS = session(secret)
// const authenticate = require('./authenticate')
// const bodyParser = require('body-parser')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const db = require('./db_connection')
const fileUpload = require('express-fileupload')
// const pgp = require('pg-promise')()

const User = require('./models/users-db-logic')()
const Event = require('./models/events-db-logic')()
const Policy = require('./models/policies-db-logic')()
const Post = require('./models/posts-db-logic')()
const Actions = require('./models/actions-db-logic')()

app.use(express.json())
app.use(express.static(__dirname+"/site"))
app.use(cors())
// app.use(bodyParser.urlencoded({extended:true}))
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())

app.use(eS)
app.use(passport.initialize());
app.use(passport.session());

// const removeApostrophes = async (req,res,next) => {
//     const searchRegExp = /'/g;
//     const replaceWith = "''";
//     const result = req.body.firstName.replace(searchRegExp, replaceWith)
// }

// app.use(removeApostrophes())

passport.use(new Strategy((username,password,callback)=>{
    db.one(`SELECT * FROM users WHERE username='${username}'`)
    .then(u=>{
        console.log(u,'51') //
        bcrypt.compare(password, u.password)
        .then(result=>{
            if(!result) return callback(null,false)
            return callback(null, u)
        })
    })
    .catch(()=>callback(null,false))
}))
passport.serializeUser((user,callback)=>callback(null, user.id))
passport.deserializeUser((id,callback)=>{
    db.one(`SELECT * FROM users WHERE id='${id}'`)
    .then(u=>{
        // console.log(u,'65')
        return callback(null,u)
    })
    .catch(()=>callback({'not-found':'No User With That ID Is Found'}))
})

const checkIsLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()) return next()
    return res.send('error')
}

const createUser = async (req,res,next) => {
    console.log(req.body,'68')
    let hash = await bcrypt.hash(req.body.password, SALT_ROUNDS)
    let newUser = await db.one(`INSERT INTO users (username,password,firstName,lastName,email,streetaddress,city,state,zipcode,cause_one,cause_two,cause_three) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,[req.body.username,hash,req.body.firstName,req.body.lastName,req.body.email,req.body.streetaddress,req.body.city,req.body.state,req.body.zipcode,req.body.cause1,req.body.cause2,req.body.cause3])
    next()
    return newUser
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// LOGINS
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

app.post('/login', passport.authenticate('local'), (req,res) => {
    console.log(req.user,'113')
    res.send(req.user)
})

app.post('/login/register', createUser, async (req,res,next) => {
    console.log(`User ID after registration: ${req.body.username}`)
    res.redirect('/#/LoginForm')
})

app.post('/login/survey', async (req, res, next) => {
    let isValid = await User.storeUsersCauses(req.body.cause1, req.body.cause2, req.body.cause3, req.user.username)
    if(isValid){
        res.send(isValid)
    } else {
        res.redirect('/#/Survey')
    }
})

app.get('/user', async (req,res)=>{
    let user = await User.getUser(req.user.username)
    res.send(user)
})

app.post('/user/profilePic/:username', async (req,res)=>{
    if(req.files === null) {
        return res.status(400).json({msg:'No file uploaded'})
    }

    const now = Date.now()

    const file = req.files.file
    console.log(file,'117')
    file.mv(`/Users/dylan/dc_projects/actapp-protest/public/images/${now}_${file.name}`, err => {
        console.log(err)
        return res.status(500).send(err)
    })
    await User.updateProfilePic(`/images/${now}_${file.name}`,req.params.username)
    res.json({ fileName: file.name, filePath: `/images/${file.name}`})
})

app.get('/events', async (req,res)=>{
    let events = await Event.getAllEvents()
    res.send(events)
})

app.get('/events/:event_id', async (req,res)=>{
    let event = await Event.getEvent(req.params.event_id)
    res.send(event)
})

app.post('/events/create', async (req,res)=>{
    let events = await Event.createEvent(req.body.pic,req.body.cause,req.body.title,req.body.description,req.body.startTime,req.body.endTime,req.body.date,req.body.location,req.user.username,req.body.action1,req.body.action2,req.body.action3)
    res.send(events)
})

app.get('/usersEvents', async (req,res)=>{
    let events = await Event.getEventsByUser(req.user.id)
    res.send(events)
})

app.get('/policies', async (req,res)=>{
    let policies = await Policy.getPolicyByEvent(1)
    res.send(policies)
})

app.get('/posts', async (req,res)=>{
    let posts = await Post.getAllPosts()
    res.send(posts)
})

app.get('/posts/:event_id', async (req,res)=>{
    let posts = await Post.getPostsByEvent(req.params.event_id)
    res.send(posts)
})

app.post('/addPost/:event_id', async (req,res)=>{
    console.log(req.body,'218')
    let post = await Post.addPost(req.body.picurl,req.body.body,req.user.username,req.params.event_id)
    console.log(post,'220')
    return res.send(post)
})

app.get('/usersPosts', async (req,res)=>{
    let posts = await Post.getPostsByUser(req.user.username)
    res.send(posts)
})

app.post('/upload/:event_id', async (req,res)=>{
    if(req.files === null) {
        return res.status(400).json({msg:'No file uploaded'})
    }

    const now = Date.now()

    const file = req.files.file
    console.log(req.body.postText,'234')
    file.mv(`/Users/dylan/dc_projects/actapp-protest/public/images/${now}_${file.name}`, async err => {
        console.log(err)
        if(err){
            return res.status(500).send(err)
        }
        await Post.addPost(`/images/${now}_${file.name}`,req.body.postText,req.user.username,req.params.event_id)
        return res.json({ fileName: file.name, filePath: `/images/${file.name}`})
    })
})

app.get('/comments/:post_id', async (req,res)=>{
    let comments = await Post.getCommentsByPost(req.params.post_id)
    res.send(comments)
})

app.post('/addComment/:post_id', async (req,res)=>{
    let comment = await Post.addComment(req.body.comment,req.user.id,req.user.username,req.params.post_id)
    return res.send(comment)
})

app.get('/likes/:post_id', async (req,res)=>{
    let likes = await Post.getLikesByPost(req.user.id,req.params.post_id)
    res.send(likes)
})

app.post('/addLike/:post_id', async (req,res)=>{
    console.log(req.user,'239')
    let addedLike = await Post.addLike(req.user.id,req.params.post_id)
    return res.send(addedLike)
})

// app.post('/addImage', async (req,res)=>{
//     console.log(req.body,'binary')
//     let post = await Post.storeImageBinary(req.body.imgname,req.form.img)
//     return res.send(post)
// })

// app.post("/addPost/:event_id", (req,res)=>{

//     let form = {};

//     //this will take all of the fields (including images) and put the value in the form object above
//     new formidable.IncomingForm().parse(req)
//     .on('field', (name, field) => {
//         form[name] = field;
//         //form.profile image is undefined here: console.log(`form.profile_image:${form.profile_image}`)
//         console.log(`form[name]:${name},${form[name]}`)
//       })
//     .on('fileBegin', (name, file) => {
//         //sets the path to save the image
//         console.log(`is it even doing this fileBegin?: ${name}`)
//         //NEXT STEP: try to get this file path working
//         file.path = __dirname.replace('routes','') + 'public/images/' + new Date().getTime() + file.name
//     })
//     .on('file', (name, file) => {
//         //console.log('Uploaded file', name, file);
//         console.log("is it even doing this fileBegin?")
//         //can use what the form.profile_image returns as an images src when using it elsewhere
//         form.picurl = file.path.replace(__dirname.replace('routes','')+'public',"");
//         console.log(`form.profile_image: ${form.picurl}`)
//     })
//     .on('end', async ()=>{

//         console.log(`SESSION VALUES: picurl: ${form.picurl}, username: ${req.session.username}, body: ${form.body}, tags:${form.tags}`)
//         //XXXXX needs attention - profilepic
//         //let isValid = await Post.createPost(form.picurl, form.body, form.tags, req.session.user_id, req.session.username)
//         let isValid = await Post.addPost(form.picurl, form.body, req.user.username,req.params.event_id)

//         if(isValid){
//             // let currentPost = await Post.selectPost(form.picurl)
//             // let feed = []
//             // feed.append(currentPost)
//             res.send(isValid)
//         } else {
//             res.send({error: "needs more data"})
//         }
        
//     })

// })

app.get('/attendees/:id', async (req,res)=>{
    //it's logging req.params.id correctly
    console.log('211',req.params.id)
    res.send(await Event.getAttendeesByEvent(req.params.id))
})

app.get('/addAttendee/:event_id', async (req,res)=>{
    console.log('216',req.user.id,req.params.event_id)
    res.send(await Event.addAttendee(req.user.id,req.params.event_id))
})

app.get('/actions/resources', async (req,res)=>{
    res.send(await Actions.getAllActions())
})

app.get('/actions/resources/:action', async (req,res)=>{
    res.send(await Actions.findActionResources(req.params.action))
})

// app.get('/me',(req,res) => res.send(
//     {id:req.session.user_id}
// ))

app.listen(port)