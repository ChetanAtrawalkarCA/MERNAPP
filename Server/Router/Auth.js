const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('../DB/conn');
const User = require('../Model/userSchema');

router.get('/', (req, res) => {
    res.send(`Hello world from the server rotuer js`);
});

//Async await use

//Registeration Route

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Plz Fill The Data Properly" });
    }

    try {
        const userExit = await User.findOne({ email: email });

        if (userExit) {

            return res.status(422).json({ error: "Email Already Exist" });

        } else if (password != cpassword) {

            return res.status(422).json({ error: "Password Not Matching" });
        
        } else {

            const user = new User({ name, email, phone, work, password, cpassword });

            await user.save();

            res.status(201).json({ message: "User Register Successfully" });
            
        }

        
    } catch (err) {
        console.log(err);
    }
   
});

//Login Route

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
    //    console.log(email,password);
        if (!email || !password) {
            return res.status(400).json({ error: "Please Fill The Data" })
        }

        const userLogin = await User.findOne({ email: email });

        // console.log(userLogin);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAuthToken();

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials pass" });
            } else {
                res.json({ message: "User Signin Successfully" });
            }
        } else {
            res.status(400).json({ error: "Invalid Credientials" });
        }
    } catch (err) {
        console.log(err);
    }

});
module.exports = router;