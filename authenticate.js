let authenticate = (req,res,next) => {
    
    //if session password matches database password?
    if(req.session.user_id){
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = authenticate