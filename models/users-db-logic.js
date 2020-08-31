const express = require('express')
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const db = require('../db_connection')

let User = () => {
    // const register = async (username,password,firstName,lastName,email,streetaddress,city,state,zipcode,cause1,cause2,cause3) => {
    //     let user = await db.oneOrNone(`SELECT id FROM users WHERE username = '${username}'`)
    //     if(user){
    //         console.log(user)
    //         return false
    //     } else {
            
    //         console.log("isValid",user)

    //         let hashedPassword = await bcrypt.hash(password,SALT_ROUNDS)
    //         let newUser = await db.one('INSERT INTO users (username,password,firstName,lastName,email,streetaddress,city,state,zipcode,cause_one,cause_two,cause_three) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',[`${username}`,`${hashedPassword}`,`${firstName}`,`${lastName}`,`${email}`,`${streetaddress}`,`${city}`,`${state}`,`${zipcode}`,`${cause1}`,`${cause2}`,`${cause3}`])

    //         console.log(`*****20`)
    //         console.log(`This person's id is: ${newUser.id}`)
    //         return newUser
    //     }
    // }

    const login = async (username,password) => {
        let user = await db.oneOrNone(`SELECT id FROM users WHERE username = '${username}'`)
        if(user){
            bcrypt.compare(password,user.password,function(error,result){
                if(result){
                    console.log('successful login')
                    return true
                } else {
                    console.log('try again')
                    return false
                }
            })
            return user
        } else {
            return false
        }

        //since it's async it's returning a promise
        return newUser
            //then use the user id for loading that users info
    }

    //isFirstTimeUser -> in [Header?]: if the db query of the isFirstTimeUser boolean returns true, then render the survey
    const isFirstTimeUser = async (username) => {
        return await db.one(`select (firstTimeUser) from users where username = '${username}'`)
    }

    const storeUsersCauses = async (cause1,cause2,cause3,username) => {
        let causes = await db.one(`UPDATE users SET cause_one = '${cause1}', cause_two = '${cause2}', cause_three = '${cause3}' WHERE username = '${username}' RETURNING *`)
        console.log(causes)
        return causes
    }

    const updateProfilePic = async (profile_pic_url,username) => {
        return await db.one(`UPDATE users SET profilePic = '${profile_pic_url}' WHERE username = '${username}' RETURNING *`)
    }
        
    const getUser = async (username) => {
        return await db.one(`SELECT * FROM users WHERE username = '${username}'`)
    }

    return {
        // register,
        login,
        storeUsersCauses,
        updateProfilePic,
        getUser
    }
}

module.exports = User