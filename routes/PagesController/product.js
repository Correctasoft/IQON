const express = require("express");
const router = express.Router();
const CustomerModel = require('../../models/Customer');
const { multipleMongooseToObj, mongooseToObj } = require("../../helpers/mongoobjecthelper");


router.get('/', (req, res) => {
    return res.render('main/admin/product/index', {
        layout: 'admin/base',
        title: 'Product List',
    });
});

module.exports = router;