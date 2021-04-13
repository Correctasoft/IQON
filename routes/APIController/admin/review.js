const express = require("express");
const router = express.Router();
const customerModel = require('../../../models/Customer');
const ReviewModel =  require('../../../models/Review');
const {
  multipleMongooseToObj
} = require("../../../helpers/mongoobjecthelper");

router.get("/:id", async (req, res) => {
    let reviews = await ReviewModel.find({Product: req.params.id}).populate({
      path: 'Customer',
      model: customerModel,
      select: {Name:1, Phone:1}
    });

    reviews = reviews.map((review)=>{
      return {
        _id : review._id,
        Review : review.Review,
        InsertionDate: review.InsertionDate,
        Customer_name: review.Customer.Name,
        Customer_phone: review.Customer.Phone,
        IsAuthorized: review.IsAuthorized
      }
    })
    res.json(
      {
        Items: reviews,
        Count: reviews.length
      });
});

module.exports = router;