const express = require("express");
const router = express.Router();
const orderedItemModel =  require('../../../models/OrderedItem');
const salesOrderModel =  require('../../../models/SalesOrder');
const customerModel =  require('../../../models/Customer');
const categoryModel =  require('../../../models/Category');
const productModel =  require('../../../models/Product');
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { userAuthentication } = require("../../../helpers/authentication");

router.get('/', userAuthentication, async (req, res) => {
    let orders =  multipleMongooseToObj(await salesOrderModel.find({
        Date:{
            $gte: new Date().setHours(0,0,0,0),
            $lte: new Date().setHours(23,59,59,999),
        }
    }).sort({Date: -1}));
    let customerCount = await customerModel.countDocuments({});
    let categoryCount = await categoryModel.countDocuments({IsDelete: false});
    let productCount = await productModel.countDocuments({IsDelete: false});
    return res.render('main/admin/home', {
        layout: 'admin/base',
        title: 'Dashboard',
        orders,
        customerCount,
        categoryCount,
        productCount

    });
});

router.get('/login', (req, res) => {
    return res.render('main/admin/login', {
        layout: null,
    });
});

// router.get('/profile', (req, res) => {
//     return res.render('main/profile', {
//         layout: 'admin/base',
//         title: 'Profile of Owner'
//     });
// });

module.exports = router;