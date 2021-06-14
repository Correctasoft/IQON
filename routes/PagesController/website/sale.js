const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const {requireCustomerLogin, getLoggedInCustomer, getCommonData } = require('../../../middleware/web');
const saleCategoryModel =  require('../../../models/SaleCategory');

router.get('/:slug',getCommonData, getLoggedInCustomer, async (req, res) => {
    let saleCategory = await saleCategoryModel.find({Slug: req.params.slug});
    
    return res.render('main/website/sale', {
        layout: 'website/base',
        title: 'Sale - '+ saleCategory[0].Name,
        saleCategory : mongooseToObj(saleCategory[0])
    });
});

module.exports = router;