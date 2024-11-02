 const adminAuth = (req, res, next) => {
    const isAdmin = false
    

    if(!isAdmin){
        res.status(401).send("Admin is not Authorized")
    }
    else{
        next()
    }

 }


 module.exports = { adminAuth }