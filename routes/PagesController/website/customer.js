const express = require("express");
const router = express.Router();
const customerModel =  require('../../../models/Customer');
const salesOrderModel =  require('../../../models/SalesOrder');
const productModel = require("../../../models/Product");
const orderedItemModel =  require('../../../models/OrderedItem');
const bcrypt = require("bcryptjs");
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { getLoggedInCustomer, requireCustomerLogin, getCommonData } = require('../../../middleware/web');

function getErrorMessage(req){
    if (req.session) {
        if(req.session.message){
            var message = req.session.message;
            req.session.message = null;
            return message;
        }
        else{
            return null;
        }
    }
    else {
        return null;
    }
}

router.get('/my-account', getCommonData, requireCustomerLogin, getLoggedInCustomer, async(req, res) => {
    let customer = await customerModel.findOne({_id: req.session.loggedInCustomer._id});
    let orders = await salesOrderModel.find({Customer : customer._id}).sort({Date: -1});
    return res.render('main/website/customer-account', {
        layout: 'website/base',
        title: 'My Account',
        customer: mongooseToObj(customer),
        orders : multipleMongooseToObj(orders),
        message: getErrorMessage(req)
    });
});

router.post('/update-basic-info', requireCustomerLogin, async (req, res) => {
    let customer = await customerModel.findOne({_id: req.session.loggedInCustomer._id});
    bcrypt.compare(req.body.Password, customer.Password, async (err, matched) => {
        if (err) {
            req.session.message= {
                text: "Please enter the correct password",
                alertType: 'danger'
            }
            res.redirect('/');
        }
        if (matched) {

            await customerModel.updateOne({_id: req.session.loggedInCustomer._id},{
                Name : req.body.Name,
                Address : req.body.Address,
                City : req.body.City,
                Area : req.body.Area,
                Postalcode : req.body.Postcode,
                Email : req.body.Email,
                Phone : req.body.Phone,
            });
            
            req.session.message= {
                text: "Info updated, Please login again",
                alertType: 'success'
            }

            res.redirect('/auth/logout');
        } else {
            req.session.message= {
                text: "Please enter the correct password",
                alertType: 'danger'
            }
            res.redirect('/');
        }
    });
});

router.post('/change-password', requireCustomerLogin, async (req, res) => {
    customerModel.findOne({ _id: req.session.loggedInCustomer._id }).then(user=>{
        if(user!=null){
            bcrypt.compare(req.body.CurrentPassword, user.Password, async (err, matched) => {
                if (err) {
                    req.session.message= {
                        text: 'Current Passwod mismatch',
                        alertType: 'danger'
                    }
                    res.redirect("/customer/my-account");
                    return;
                    
                }
                if (matched) {
                    bcrypt.genSalt(10, async function (err, salt) {
                        bcrypt.hash(req.body.NewPassword.toString(), salt, async function (err, hash) {
                            await customerModel.updateOne({_id: user._id},{
                                $set:{
                                    Password: hash,
                                }
                            });
                            req.session.message= {
                                text: 'Password successfully updated',
                                alertType: 'success'
                            }
                            res.redirect("/customer/my-account");
                            return;
                        });
                    });
                    
                } else {
                    req.session.message= {
                        text: 'Current Passwod mismatch',
                        alertType: 'danger'
                    }
                    res.redirect("/customer/my-account");
                    return;
                }
            });
        }
        else{
            req.session.message= {
                text: 'Current Passwod mismatch',
                alertType: 'danger'
            }
            res.redirect("/customer/my-account");
            return;
        }
    });
});

router.get('/order/details/:orderId', getCommonData, requireCustomerLogin, async (req, res) => {
    let order = await salesOrderModel.findOne({_id : req.params.orderId});
    
    if(order.Customer != req.session.loggedInCustomer._id){
        req.session.message= {
            text: "You are not allowed",
            alertType: "warning"
        }
        res.redirect("/");
        return;
    }

    let items = await orderedItemModel.find({Order: req.params.orderId}).populate({
        path: 'Product',
        model: productModel
      });

    return res.render('main/website/order-details', {
      layout: 'website/base',
      title: "Order Details: "+ order.Number,
      items: multipleMongooseToObj(items),
      order: mongooseToObj(order)
    });
});

module.exports = router;