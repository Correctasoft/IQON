const express = require("express");
const router = express.Router();
const productModel = require("../../../models/Product");
const orderedItemModel =  require('../../../models/OrderedItem');
const salesOrderModel =  require('../../../models/SalesOrder');
const {
  multipleMongooseToObj, mongooseToObj
} = require("../../../helpers/mongoobjecthelper");

// need to add authentication later
router.all("/*", (req, res, next) => {
  next();
});

router.get("/", (req, res) => {
 
});

router.put("/", (req, res) => {
  
});

router.post("/", async (req, res) => {
  
});

router.delete("/:id", (req, res) => {
 
});

module.exports = router;