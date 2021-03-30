const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const {requireCustomerLogin, getCommonData, getLoggedInCustomer } = require('../../../middleware/web');
const cartModel =  require('../../../models/Cart');
const cartItemModel =  require('../../../models/CartItem');
const productModel =  require('../../../models/Product');

function getTheLoggedInCustomer(req){
    if (req.session && req.session.loggedInCustomer) {
        return req.session.loggedInCustomer;
    }
    else{
        return null;
    }
}

async function updateCartValues(cart_id){
    let cartItems =  await cartItemModel.find({Cart: cart_id});
    console.log(cartItems.length, cart_id);
    let totalQty=0, totalAmount =0;
    for(let i=0; i<cartItems.length; i++){
        totalQty+= cartItems[i].Quantity;
        totalAmount+= cartItems[i].Total;
    }
    await cartModel.updateOne({_id: cart_id},{
        $set:{
            Quantity : totalQty,
            Total : totalAmount
        }
    });
}

router.get('/', getCommonData, requireCustomerLogin, getLoggedInCustomer, async (req, res) => {
    let loggedInCustomer= getTheLoggedInCustomer(req);
    let cart = await cartModel.findOne({Owner: loggedInCustomer._id});
    let cartItems =  await cartItemModel.find({Cart: cart._id}).populate({
        path: 'Product',
        model: productModel
    });
    return res.render('main/website/cart', {
        layout: 'website/base',
        title: 'Shopping Cart',
        cart: mongooseToObj(cart),
        cartItems: multipleMongooseToObj(cartItems)
    });
});


module.exports = router;