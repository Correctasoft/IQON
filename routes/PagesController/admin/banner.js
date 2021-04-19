const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { userAuthentication, getLoggedInUser } = require("../../../helpers/authentication");

router.get('/', userAuthentication, getLoggedInUser, (req, res) => {
    return res.render('main/admin/banner/index', {
        layout: 'admin/base',
        title: 'Banner List',
    });
});

module.exports = router;