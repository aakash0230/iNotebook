const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = "hamaareSaathShriRaghunathToKisBaatKiChinta"

const fetchUser = (req, res, next) => {
    // get the user form the jwt token and add id to the next
    const token  = req.header("auth-token");
    if(!token){
        res.status(401).json({
            status : "Failure",
            msg : "Please authenticate using a valid token"
        })
    }
    try{
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    }
    catch(err){
        res.status(401).json({
            status : "Failure",
            msg : err.message
        })
    }
}

module.exports = fetchUser;