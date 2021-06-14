const express = require("express");
const router = express.Router();
const { multipleMongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { getLoggedInCustomer } = require('../../../middleware/web');
const productModel =  require('../../../models/Product');
const categoryModel = require('../../../models/Category');
const SaleCategoryModel = require("../../../models/SaleCategory");

router.post('/get-products', async (req, res) => {
    let page = req.body.page? req.body.page: 1;
    let product_per_page = 16;
    let products= [];
   
    products = await productModel.find({
        IsDelete: false,
        SaleCategory: req.body.sale_id,
    }).populate({
        path: 'Category',
        model: categoryModel
    }).skip((page-1)*product_per_page).limit(product_per_page);

    let total_products = await productModel.find({
        IsDelete: false,
        SaleCategory: req.body.sale_id,
    }).count();

    return res.render('main/website/product-grid', {
        layout: null,
        products: multipleMongooseToObj(products),
        total_products: total_products,
        pages: Math.ceil(total_products / product_per_page),
        current: page,
        itemsperpage: product_per_page,
    });
});

module.exports = router;