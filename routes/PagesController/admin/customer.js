const express = require("express");
const router = express.Router();
const customerModel = require('../../../models/Customer');
const { multipleMongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { userAuthentication } = require("../../../helpers/authentication");

router.get('/', userAuthentication, async (req, res) => {
    let customerList = await customerModel.find({IsDelete: false});
    return res.render('main/admin/customer/index', {
        layout: 'admin/base',
        title: 'Customers',
        customerList: multipleMongooseToObj(customerList),
    });
});

module.exports = router;