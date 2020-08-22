const express = require('express')
const app = express()
//move this db variable to the 'models' folder where the actual db queries are run
const db = require('./db_connection')
const port = 3333

const User = require('./models/users-db-logic')()
const Event = require('./models/events-db-logic')()

app.use(express.json())
app.use(express.static(__dirname+"/site"))

app.get('/', async (req,res)=>{
    let user = await User.getUsers(1)
    res.send({user})
})

app.get('/events', async (req,res)=>{
    let events = await Event.getAllEvents()
    res.send({events})
})

app.listen(port)