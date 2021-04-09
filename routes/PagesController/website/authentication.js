const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const customerModel =  require('../../../models/Customer');
const cartModel =  require('../../../models/Cart');

router.post('/login', async (req, res) => {
    
    customerModel.findOne({ $or:[ {Email: req.body.Email }, {Phone :req.body.Email}] }).then(customer=>{
        if(customer!=null){
            bcrypt.compare(req.body.Password, customer.Password, (err, matched) => {
                if (err) {
                    req.session.message= {
                        text: "Please enter the correct password",
                        alertType: 'danger'
                    }
                    res.redirect('/');
                }
                if (matched) {
                    //create session
                    let user = {
                        _id: customer._id,
                        Email: customer.Email,
                        Name: customer.Name,
                        type: 'customer'
                    }
                    req.session.loggedInCustomer= user;
                    

                    req.session.message= {
                        text: "Hello "+customer.Name,
                        alertType: 'success'
                    }

                    res.redirect('/');
                } else {
                    req.session.message= {
                        text: "Please enter the correct password",
                        alertType: 'danger'
                    }
                    res.redirect('/');
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

router.post('/regsiter', async (req, res) => {
    let check = await customerModel.find({ $or:[ {Email: req.body.Email }, {Phone :req.body.Phone}] });
    
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
                const newCustomer = new customerModel({
                    Name: req.body.Name,
                    Email: req.body.Email,
                    Phone: req.body.Phone,
                    Password: hash,
                });
                newCustomer
                .save()
                .then((savedCustomer) => {
                    //create cart for the user
                    let cart = new cartModel({
                        Owner: savedCustomer._id,
                        Products: [],
                        Total: 0,
                        Quantity: 0
                    })
                    cart.save();
                    //create session
                    let user = {
                        _id: savedCustomer._id,
                        Email: savedCustomer.Email,
                        Name: savedCustomer.Name,
                        type: 'customer'
                    }
                    req.session.loggedInCustomer= user;
                    res.redirect('/');
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
            if(message != null){
                req.session.message = message;
            }
            res.redirect('/');
        })
    }
});

module.exports = router;