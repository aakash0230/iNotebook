const express = require("express")
const router = express.Router()
const User = require("../models/Users")
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fetchuser = require("../middlewares/fetchUser");

const JWT_SECRET = "hamaareSaathShriRaghunathToKisBaatKiChinta"
require('dotenv').config();



//Route 1 --> Create a user using : POST  "api/auth/creatUser". No login required
router.post("/createUser", [
    body('name', 'Enter a valid name !!!').isLength({min : 3}),
    body('email', 'Enter a valid email !!!').isEmail(),
    body('password', 'Password must be at least 5 characters !!!').isLength({min : 5})
], async (req, res) => {
    try{
        let userExist = await User.findOne({
            email : req.body.email
        })
        if(userExist){
            return res.status(400).json({
                status : "Failure",
                msg : "User with this email already exists"
            })
            // process.exit(1);
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : secPassword
        })
        const result = await user.save()
        const authToken = jwt.sign(result.id, JWT_SECRET);
        res.status(201).json({
            status : "Success",
            authToken
        })
    }
    catch(err){
        console.log("Bhai mai aa gaya isme")
        // console.log(err.message)
        res.status(500).json({
            status : "failure",
            msg : err.message
        })
    }
})

// Route 2 -->  Authenticate a user using : POST  "api/auth/login". No login required
router.post("/login", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(501).json({
                status : "Failure",
                msg : "Please try to login with correct credentials"
            })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(501).json({
                status : "Failure",
                msg : "Please try to login with correct credentials"
            })
        }
        const data = {
            user : {
                id : user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.status(200).json({
            status : "Success",
            id : user.id,
            authToken, 
        })
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({
            status : "failure",
            msg : err.message
        })
    }
})


// Route 3 --> Get logged in User details using : POST "api/auth/gestUser". Login rquired
router.post("/guestUser", fetchuser, async (req, res) => {
    try{
        const userId = req.user.id; 
        const user = await User.findById(userId).select("-password")
        res.status(200).json({
            status : "Success",
            result : user
        })
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({
        status : "failure",
        msg : err.message
        })
    }

})

module.exports = router;