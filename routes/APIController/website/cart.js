const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { getLoggedInCustomer, requireCustomerLogin, checkCustomerLoginAPI } = require('../../../middleware/web');
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

router.post('/remove-item-from-cart', checkCustomerLoginAPI, async (req,res)=>{
    let {Cart} = await cartItemModel.findOne({_id: req.body.cart_item_id});
    await cartItemModel.deleteOne({_id: req.body.cart_item_id});

    //update cart values
    await updateCartValues(Cart);

    //return success message
    res.json({
        text: "Cart item removed",
        alertType: "success"
    })
});

router.post('/add-to-cart', checkCustomerLoginAPI, async (req,res)=>{
    try{
        let loggedInCustomer = getTheLoggedInCustomer(req);
        let cart = await cartModel.findOne({Owner: loggedInCustomer._id});
        let product = await productModel.findOne({_id: req.body.product});
        if(product.StockAvailable == false){
            res.json({
                text: "Sorry! This Product is out of stock",
                alertType: "danger"
            });
            return;
        }
        let size = req.body.size ? req.body.size : null;
        let color = req.body.color ? req.body.color : null;
        
        let price= product.DiscountedPrice;
        if(product.SellingPrice < product.DiscountedPrice){
            price= product.SellingPrice;
        }

        let itemInCartItems = await cartItemModel.findOne({
                                        Cart: cart._id,
                                        Product:product._id,
                                        Size: size,
                                        Color: color
                                    });

        //add or update cart Items
        if(itemInCartItems){// already exists in cart
            let updateQty = itemInCartItems.Quantity+parseInt(req.body.quantity);
            await cartItemModel.updateOne({_id: itemInCartItems._id},{
                $set:{
                    Quantity : updateQty,
                    Price : price,
                    Total : parseFloat(price)*parseInt(updateQty)
                }
            });
        }
        else{
            let newCartItem =  new cartItemModel({
                Cart : cart._id,
                Product : product._id,
                Size: size,
                Color: color,
                Quantity : parseInt(req.body.quantity),
                Price : price,
                Total : parseFloat(price)*parseInt(req.body.quantity)
            });
            await newCartItem.save();
        }
        
        //update cart values
        await updateCartValues(cart._id);

        //return success message
        res.json({
            text: "Cart item Added",
            alertType: "success"
        })
    }
    catch(e){
        res.json({
            text: "Something went wrong",
            alertType: "danger"
        })
    }
});

router.get('/get-cart-for-this-user', async (req, res) => {
    let loggedInCustomer = getTheLoggedInCustomer(req);
    if(loggedInCustomer){
        let cart = await cartModel.findOne({Owner: loggedInCustomer._id});
        let cartItems =  await cartItemModel.find({Cart: cart._id}).populate({
            path: 'Product',
            model: productModel
        });

        return res.render('main/website/cart-dropdown', {
            layout: null,
            user: loggedInCustomer,
            cart: mongooseToObj(cart),
            cartItems: multipleMongooseToObj(cartItems)
        });
    }
    else{
        return res.render('main/website/cart-dropdown', {
            layout: null,
            user: loggedInCustomer,
        });
    }
   
});

module.exports = router;