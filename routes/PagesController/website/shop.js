const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const {requireCustomerLogin, getLoggedInCustomer, getCommonData } = require('../../../middleware/web');
const productModel =  require('../../../models/Product');
const categoryModel =  require('../../../models/Category');
const Category = require("../../../models/Category");

router.get('/',getCommonData, getLoggedInCustomer, async (req, res) => {
    let categories = await categoryModel.find({IsDelete: false});

    return res.render('main/website/shop', {
        layout: 'website/base',
        title: 'Shop',
        categories : multipleMongooseToObj(categories),
    });
});

router.get('/search', getCommonData, async (req, res) => {
    return res.render('main/website/search-result', {
        layout: 'website/base',
        title: 'Search result for - '+ req.query.query,
        keyword: req.query.query
    });
});

router.get('/category/:slug',getCommonData, getLoggedInCustomer, async (req, res) => {
    let categories = await categoryModel.find({Slug: req.params.slug});
    
    return res.render('main/website/shop', {
        layout: 'website/base',
        title: 'Category - '+ categories[0].Name,
        categories : multipleMongooseToObj(categories),
    });
});

module.exports = router;