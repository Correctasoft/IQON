const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const {userAuthentication} = require('../../../helpers/authentication');

router.get('/', (req, res) => {
    return res.render('main/admin/productimages/index', {
        layout: 'admin/base',
        title: 'Product Images',
    });
});

module.exports = router;