const express = require("express");
const router = express.Router();
const ProductModel = require("../../../models/Product");
const ReviewModel =  require('../../../models/Review');
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { userAuthentication } = require("../../../helpers/authentication");

router.get('/',  userAuthentication, async(req, res) => {
    let products = await ProductModel.find({IsDelete: false});
    return res.render('main/admin/review/index', {
        layout: 'admin/base',
        title: 'Product Reviews',
        products: multipleMongooseToObj(products),
    });
});

router.post('/delete',  userAuthentication, async(req, res) => {
    ReviewModel.deleteOne({_id: req.body.review_id}).then((_)=>{
        res.redirect("/admin/review");
    });
});

router.post('/authorization',  userAuthentication, async(req, res) => {
    ReviewModel.updateOne({_id: req.body.review_id},{
        $set:{
            IsAuthorized: req.body.review_sts
        }
    }).then((_)=>{
        res.redirect("/admin/review");
    });
});


module.exports = router;