const express = require("express");
const router = express.Router();
const { multipleMongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { getLoggedInCustomer } = require('../../../middleware/web');
const productModel =  require('../../../models/Product');
const categoryModel =  require('../../../models/Category');
const Category = require("../../../models/Category");

router.post('/filter-products', async (req, res) => {
    let page = req.body.page? req.body.page: 1;
    let product_per_page = 16;
    let products= [];

    let parentCategories = await categoryModel.find({Parent:{ $in : req.body.categories}}).select('_id');
    parentCategories = parentCategories.map((x)=>{return x.id});
    var categories = parentCategories.concat(req.body.categories);
   
    products = await productModel.find({
        IsDelete: false,
        Category: {$in: categories},
        DiscountedPrice: {
            $gte: parseInt(req.body.price_range[0]),
            $lte: parseInt(req.body.price_range[1]),
        }
    }).populate({
        path: 'Category',
        model: categoryModel
    }).skip((page-1)*product_per_page).limit(product_per_page);

    let total_products = await productModel.find({
        IsDelete: false,
        Category: {$in: categories},
        DiscountedPrice: {
            $gte: parseInt(req.body.price_range[0]),
            $lte: parseInt(req.body.price_range[1]),
        }
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

router.post('/search-products',  async (req, res) => {
    let keyword = req.body.keyword;
    let page = req.body.page? req.body.page: 1;
    let product_per_page = 16;
    let products= [];

    
    let categories = await categoryModel.find({
        Name: {
            $regex: `${keyword}`,
            $options: "i",
        }
    }).select('id');
    categories = categories.map((x)=>{return x.id});
    
    //search in category name
    //search in product name
    //search in tags
    products = await productModel.find({
        IsDelete: false,
        $or: [
            {
                Name: {
                    $regex: `${keyword}`,
                    $options: "i",
                },  
            },
            {
                Tags: {
                    $regex: `${keyword}`,
                    $options: "i",
                },
            },
            {
                Category:{
                    $in: categories
                },
            }
        ],
    }).populate({
        path: 'Category',
        model: categoryModel
    }).skip((page-1)*product_per_page).limit(product_per_page);

    let total_products = await productModel.find({
        IsDelete: false,
        $or: [
            {
                Name: {
                    $regex: `${keyword}`,
                    $options: "i",
                },  
            },
            {
                Tags: {
                    $regex: `${keyword}`,
                    $options: "i",
                },
            },
            {
                Category:{
                    $in: categories
                },
            }  
        ],
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