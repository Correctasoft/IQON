const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const {requireCustomerLogin, getCommonData, getLoggedInCustomer } = require('../../../middleware/web');
const customerModel =  require('../../../models/Customer');
const cartModel =  require('../../../models/Cart');
const cartItemModel =  require('../../../models/CartItem');
const orderedItemModel =  require('../../../models/OrderedItem');
const productModel =  require('../../../models/Product');
const salesOrderModel =  require('../../../models/SalesOrder');
const {GetSequenceNextValue} = require('../../../helpers/sequence-helper');


router.get('/',getCommonData,requireCustomerLogin, getLoggedInCustomer, async (req, res) => {
    let customer = await customerModel.findOne({_id: req.session.loggedInCustomer._id});
    let cart = await cartModel.findOne({Owner: customer._id});
    let cartItems =  await cartItemModel.find({Cart: cart._id}).populate({
        path: 'Product',
        model: productModel
    });

    if(cartItems.length == 0){
        req.session.message= {
            text: "Add product in cart to checkout",
            alertType: 'warning'
        }
        res.redirect('/');
    }
    else{
        return res.render('main/website/checkout', {
            layout: 'website/base',
            title: 'Checkout',
            customer : mongooseToObj(customer),
            cart : mongooseToObj(cart),
            cartItems: multipleMongooseToObj(cartItems)
        });
    }
});

router.post('/',requireCustomerLogin, getLoggedInCustomer, async (req, res) => {
    //copy cart to orders
    let seq= await GetSequenceNextValue('Order');
    let cart = await cartModel.findOne({Owner: req.session.loggedInCustomer._id});
    
    // return;
    let order = await new salesOrderModel({
                            Customer : cart.Owner,
                            Number : "ORD-"+seq,
                            Date  : new Date(),
                            Status : 'Pending',
                            Total : cart.Total,
                            Quantity: cart.Quantity,
                            PaymentMethod: 'COD',
                            CustomerName: req.body.Name,
                            CustomerPhone: req.body.Phone,
                            CustomerEmail: req.body.Email,
                            BillingAddress: req.body.Address,
                            BillingCity: req.body.City,
                            BillingArea: req.body.Area,
                            BillingPostalcode: req.body.Postalcode,
                            Note: req.body.Note
                        }).save();
    
    let cartItems = await cartItemModel.find({Cart: cart._id});
    cartItems = multipleMongooseToObj(cartItems);
    for(let i=0; i< cartItems.length; i++){
        delete cartItems[i]._id;
        delete cartItems[i].Cart;
        cartItems[i].Order =  order._id;
        await new orderedItemModel(cartItems[i]).save();
    }

    //update number of orders for this customer
    await customerModel.updateOne({_id: cart.Owner},{
        $inc:{
            NumberOfOrders: 1
        }
    })

    //delete cart items
    await cartItemModel.deleteMany({Cart: cart._id});
    //update cart to 0
    await cartModel.updateOne({_id: cart._id},{
        $set:{
            Total: 0,
            Quantity: 0
        }
    });

    req.session.message= {
        text: "Your order is submitted successfully",
        alertType: 'success'
    }
    res.redirect('/');

});

module.exports = router;