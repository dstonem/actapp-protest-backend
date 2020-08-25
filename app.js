const express = require('express')
const app = express()
const cors = require('cors')
//move this db variable to the 'models' folder where the actual db queries are run
const db = require('./db_connection')
const port = 3333

const User = require('./models/users-db-logic')()
const Event = require('./models/events-db-logic')()
const Policy = require('./models/policies-db-logic')()
const Post = require('./models/posts-db-logic')()

app.use(express.json())
app.use(express.static(__dirname+"/site"))
app.use(cors())

app.get('/user', async (req,res)=>{
    let user = await User.getUsers(1)
    res.send(user)
})

app.get('/events', async (req,res)=>{
    let events = await Event.getAllEvents()
    res.send(events)
})

app.get('/policies', async (req,res)=>{
    let policies = await Policy.getPolicyByEvent(1)
    res.send(policies)
})

app.get('/posts', async (req,res)=>{
    let posts = await Post.getPostsByEvent(1)
    res.send(posts)
})

app.listen(port)