const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { userAuthentication, getLoggedInUser } = require("../../../helpers/authentication");
const ProductModel = require("../../../models/Product");

router.get('/', userAuthentication, async (req, res) => {
    try {
        let products = await ProductModel.find({IsDelete: false});
        for(let i=0; i<products.length; i++){
            console.log(products[i]._id);
            await ProductModel.updateOne({_id: products[i]._id},{
                $set:{
                    Slug: products[i].Code
                }
            })
        }
        res.json({"message":"Done !"});
      }
      catch(err) {
        res.json({"message":"Error !"});
      }
});

module.exports = router;