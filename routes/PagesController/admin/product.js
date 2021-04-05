const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { userAuthentication } = require("../../../helpers/authentication");

router.get('/', userAuthentication, (req, res) => {
    return res.render('main/admin/product/index', {
        layout: 'admin/base',
        title: 'Product List',
    });
});

module.exports = router;