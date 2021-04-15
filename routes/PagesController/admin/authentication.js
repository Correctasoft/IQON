const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const userModel =  require('../../../models/User');
const { accessTokenSecret } = require("../../../config/secretkeys"); 
const { refreshTokenSecret } = require("../../../config/secretkeys"); 

router.post('/login', async (req, res) => {
    userModel.findOne({ $or:[ {Email: req.body.Email }, {Phone :req.body.Email}] }).then(user=>{
        if(user!=null){
            bcrypt.compare(req.body.Password, user.Password, (err, matched) => {
                if (err) {
                    req.session.message= {
                        text: "Please enter the correct password",
                        alertType: 'danger'
                    }
                    res.redirect('/admin/auth/login');
                }
                if (matched) {
                    //create session
                    let userObj = {
                        _id: user._id,
                        Email: user.Email,
                        Name: user.UserName,
                        type: 'user'
                    }
                    
                    
                    // generate an access token
                    userObj.accessToken = jwt.sign({ Email: userObj.Email, Name: userObj.Name }, accessTokenSecret, { expiresIn: '30m' });
                    
                    req.session.loggedInUser= userObj;
                    
                    // req.session.message= {
                    //     text: "Hello "+user.Name,
                    //     alertType: 'success'
                    // }

                    res.redirect('/admin');
                } else {
                    req.session.message= {
                        text: "Please enter the correct password",
                        alertType: 'danger'
                    }
                    res.redirect('/admin/auth/login');
                }
            });
        }
        else{
            req.session.message= {
                text: "User not found !",
                alertType: 'danger'
            }
            res.redirect('/');
        }
    });
});

router.post('/register', async (req, res) => {
    
    let check = await userModel.find({ $or:[ {Email: req.body.Email }, {Phone :req.body.Phone}] });
    
    if (check.length > 0) {
        //this user already exists
        req.session.message= {
            text: "User already exists with this Email or Phone.",
            alertType: 'danger'
        }
        res.redirect('/');
    }
    else {
        bcrypt.genSalt(10, async function (err, salt) {
            bcrypt.hash(req.body.Password.toString(), salt, function (err, hash) {
                const newUser = new userModel({
                    UserName: "Admin",
                    Email: req.body.Email,
                    Password: hash,
                });
                newUser
                .save()
                .then((savedCustomer) => {
                    //create session
                    // let user = {
                    //     _id: savedCustomer._id,
                    //     Email: savedCustomer.Email,
                    //     Name: savedCustomer.Name,
                    //     type: 'user'
                    // }
                    // req.session.loggedInUser= user;
                    res.redirect('/admin');
                })
                .catch((err) => {
                    console.log(err);
                });
            });
        });
    }
});

//Logout
router.get('/logout', (req, res) => {
    let message=null;
    if(req.session.message){
        message = req.session.message;
    }
    
    if (req.session) {
        req.session.destroy(() => {
            if(message){
                console.log(req.session);
                req.session.message = message;
            }
            res.redirect('/admin/login');
        })
    }
});

module.exports = router;