const express = require("express");
const router = express.Router();
const bannerModel =  require('../../../models/Banner');
const categoryModel =  require('../../../models/Category');
const productModel =  require('../../../models/Product');
const outletModel =  require('../../../models/Outlet');
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { getCommonData ,getLoggedInCustomer, requireCustomerLogin } = require('../../../middleware/web');
function getErrorMessage(req){
    if (req.session) {
        if(req.session.message){
            var message = req.session.message;
            req.session.message = null;
            return message;
        }
        else{
            return null;
        }
    }
    else {
        return null;
    }
}

router.get('/', getLoggedInCustomer, async (req, res) => {
    let banners = await bannerModel.find({}).limit(3).sort({Order: 1});
    let parentCategories = multipleMongooseToObj(await categoryModel.find({Parent: null, IsDelete: false}));
    for(let i=0; i<parentCategories.length; i++){
        parentCategories[i].children = multipleMongooseToObj(await categoryModel.find({
            Parent: parentCategories[i]._id,
            IsDelete: false,
        }));
    }
    let categoryUnderMen = parentCategories.filter(category=>{
        return category.Name == "Men";
    })[0].children;

    let idsCategoryUnderMen = categoryUnderMen.map(category=> {return category._id});
    let featuredProductsMen= multipleMongooseToObj(await productModel.find({
        IsFeatured: true,
        IsDelete: false,
        Category:{
            $in: idsCategoryUnderMen
        }
    }));

    let categoryUnderWomen = parentCategories.filter(category=>{
        return category.Name == "Women";
    })[0].children;

    let idsCategoryUnderWomen = categoryUnderWomen.map(category=> {return category._id});
    let featuredProductsWomen= multipleMongooseToObj(await productModel.find({
        IsFeatured: true,
        IsDelete: false,
        Category:{
            $in: idsCategoryUnderWomen
        }
    }));

    let newArivalMen = multipleMongooseToObj(await productModel.find({
        IsDelete: false,
        Category:{
            $in: idsCategoryUnderMen
        }
    }).sort({InsertionDate:-1}).limit(12));

    let newArivalWomen = multipleMongooseToObj(await productModel.find({
        IsDelete: false,
        Category:{
            $in: idsCategoryUnderWomen
        }
    }).sort({InsertionDate:-1}).limit(12));
    
    return res.render('main/website/home', {
        layout: 'website/base',
        title: 'Home',
        banners: multipleMongooseToObj(banners),
        categoriesFroMenu :parentCategories,
        parentCategories: parentCategories,
        featuredProductsWomen,
        featuredProductsMen,
        newArivalMen,
        newArivalWomen,
        message : getErrorMessage(req),
    });
});

router.get('/about', getCommonData, (req, res)=>{
    return res.render('main/website/about', {
        layout: 'website/base',
        title: 'About',
    });
});

router.get('/store-locator', getCommonData, async (req, res)=>{
    let outlets = await outletModel.find({});
    return res.render('main/website/outlets', {
        layout: 'website/base',
        title: 'Stores',
        outlets :multipleMongooseToObj(outlets),
    });
});

router.get('/error', (req, res)=>{
    return res.render('main/website/error', {
        layout: 'website/base',
        title: 'error',
    });
});

module.exports = router;