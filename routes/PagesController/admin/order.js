const express = require("express");
const router = express.Router();
const productModel = require("../../../models/Product");
const orderedItemModel =  require('../../../models/OrderedItem');
const salesOrderModel =  require('../../../models/SalesOrder');
const {
  multipleMongooseToObj, mongooseToObj
} = require("../../../helpers/mongoobjecthelper");
const { userAuthentication } = require("../../../helpers/authentication");

router.get('/',userAuthentication, async (req, res) => {
    let orders =  multipleMongooseToObj(await salesOrderModel.find({}).sort({Date: -1}));
    return res.render('main/admin/order', {
        layout: 'admin/base',
        title: 'Order List',
        orders
    });
});

router.get('/details/:orderId', async (req, res) => {
    let items = await orderedItemModel.find({Order: req.params.orderId}).populate({
      path: 'Product',
      model: productModel
    });

    let order = await salesOrderModel.findOne({_id : req.params.orderId});

    return res.render('main/admin/order/details', {
      layout: 'admin/base',
      title: "Order Details: "+ order.Number,
      items: multipleMongooseToObj(items),
      order: mongooseToObj(order)
    });
});

router.post('/change-status', async(req, res) => {
    await salesOrderModel.updateOne({_id: req.body.orderId},{
      $set:{
        Status: req.body.status
      }
    });
    res.redirect('./details/'+req.body.orderId);
});

module.exports = router;