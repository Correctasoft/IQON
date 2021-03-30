const { multipleMongooseToObj } = require("../helpers/mongoobjecthelper");
const categoryModel =  require('../models/Category');

function getLoggedInCustomer(req, res, next) {
    if (req.session && req.session.loggedInCustomer) {
        res.locals.user = req.session.loggedInCustomer;
    }
    return next();
}

function requireCustomerLogin(req, res, next) {
    if (req.session && req.session.loggedInCustomer) {
        return next();
    }
    else {
        req.session.message= {
            text: "Please login to access",
            alertType: "warning"
        }
        res.redirect('/');
    }
}

function checkCustomerLoginAPI(req, res, next) {
    if (req.session && req.session.loggedInCustomer) {
        return next();
    }
    else {
        return res.json({
            text: 'You are not logged in',
            alertType: 'danger',
        })
    }
    
}

async function getCommonData(req, res, next) {
    let parentCategories = multipleMongooseToObj(await categoryModel.find({Parent: null, IsDelete: false}));
    for(let i=0; i<parentCategories.length; i++){
        parentCategories[i].children = multipleMongooseToObj(await categoryModel.find({
            Parent: parentCategories[i]._id,
            IsDelete: false,
        }));
    }
    res.locals.categoriesFroMenu = parentCategories;
    return next();
}

module.exports = { getLoggedInCustomer, requireCustomerLogin, checkCustomerLoginAPI, getCommonData };