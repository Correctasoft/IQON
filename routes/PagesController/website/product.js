const express = require("express");
const router = express.Router();
const productModel =  require('../../../models/Product');
const categoryModel =  require('../../../models/Category');
const customerModel = require('../../../models/Customer');
const reviewModel =  require('../../../models/Review');
const orderItemModel =  require('../../../models/OrderedItem');
const salesOrderModel =  require('../../../models/SalesOrder');
const imageModel = require('../../../models/Image');
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const Product = require("../../../models/Product");
const {getCommonData, getLoggedInCustomer, requireCustomerLogin } = require('../../../middleware/web');

async function checkIfThisUserHavePurchasedThisProduct(product_id, customer_id){
    let orders =  await salesOrderModel.find({Customer: customer_id});
    let ordersId = orders.map(x=>{return x._id});
    let items = await orderItemModel.find({
        Product: product_id,
        Order: {
            $in: ordersId
        }
    });
    
    if(items.length > 0){
        return true;
    }
    else{
        return false;
    }
}

router.get('/:slug', getCommonData, getLoggedInCustomer, async (req, res) => {

    let allowAddingReview = false;
    
    let product = await productModel.findOne({IsDelete: false, Slug: req.params.slug}).populate({
        path: 'Category',
        model: categoryModel
    });

    let message = null;
    if(req.query.msg){
        if(req.query.msg == 1){
            message= {
                'text': 'Please select attributes first',
                'alertType': 'warning',
            }
        }
        else if(req.query.msg == 2){
            message= {
                'text': 'Review submitted. Waiting to be authorized by Admin',
                'alertType': 'success',
            }
        }
    }
    product = mongooseToObj(product);
    if(product.Color && product.Color != ''){
        product.Color = product.Color.split(',');
    }
    if(product.Size && product.Size != ''){
        product.Size = product.Size.split(',');
        product.Size = product.Size.map(p=> {return p.trim();})
    }
    product.images = multipleMongooseToObj(await imageModel.find({Product: product._id, IsDelete: false}));
    
    if(res.locals.user != undefined){
        allowAddingReview = await checkIfThisUserHavePurchasedThisProduct(product._id, res.locals.user ._id);
    }

    let realtedProducts = multipleMongooseToObj (await productModel.find({Category: product.Category}).populate({
        path: 'Category',
        model: categoryModel
    }));
    realtedProducts = realtedProducts.filter((x)=>{
        if(x._id+"" == product._id+"")
            return false;
        else
            return true;
    });

    let reviews = multipleMongooseToObj( await reviewModel.find({Product: product._id, IsAuthorized: true}).populate({
        path: 'Customer',
        model: customerModel
    }));
    return res.render('main/website/product-details', {
        layout: 'website/base',
        title: 'Product',
        product,
        message,
        realtedProducts,
        allowAddingReview,
        reviews
    });
});

router.post('/review',requireCustomerLogin, getLoggedInCustomer, async (req, res) => {
    
    let newReview = new reviewModel({
        Product   : req.body.product,
        Customer  : req.body.customer,
        Review    : req.body.review,
    });
    newReview
    .save()
    .then((savedData) => {
        res.redirect("/product/"+req.body.slug+"?msg=2");
    });
});

router.post('/review/delete',requireCustomerLogin, async (req, res) => {
    await reviewModel.deleteOne({_id: req.body.review_id});
    res.redirect("/product/"+req.body.product_slug);
});

module.exports = router;