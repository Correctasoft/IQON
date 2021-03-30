const express = require("express");
const router = express.Router();
const CategoryModel = require("../../../models/Category");
const { multipleMongooseToObj } = require("../../../helpers/mongoobjecthelper");

// const { userAuthentication } = require("../../helpers/authentication");

// need to add authentication later
router.all("/*", (req, res, next) => {
  next();
});

router.get("/", (req, res) => {
    CategoryModel.find({IsDelete: false}).populate({
      path: 'Parent',
      model: CategoryModel
    })
    .then((categories) => {
      res.json({
        Items: categories,
        Count: categories.length,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/", (req, res) => {
  console.log(req.body);
    CategoryModel.updateOne(
    {
      _id: req.body.category_id,
    },
    {
      $set: {
        Name: req.body.categoryName,
        Image: req.body.categoryImage,
        Parent: req.body.categoryParent,
        IsFeatured: req.body.categoryIsFeatured,
      },
    }
  )
    .then((_) => {
      res.json({
        status: 200,
      });
    })
    .catch((err) => console.log(err));
});

router.post("/", (req, res) => {
  const newCategory = new CategoryModel({
    Name: req.body.categoryName,
    Image: req.body.categoryImage,
    Parent: req.body.categoryParent,
    IsFeatured: req.body.categoryIsFeatured,
  });
  newCategory
    .save()
    .then((savedCategory) => {
      res.json({
        status: 200,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", (req, res) => {
  // CategoryModel.findOne({
  //   _id: req.params.id,
  // }).then((category) => {
  //   category.delete();
  //   res.json({
  //     status: 200,
  //   });
  // });
  CategoryModel.updateOne({_id: req.params.id},
    {
      $set: {
        IsDelete: true,
      },
    }
  ).then((_) => {
      res.json({
        status: 200,
      });
    })
    .catch((err) => console.log(err));
});

router.get('/parent-categories', (req,res)=>{
  CategoryModel.find({Parent : null, IsDelete: false}).select({ "Name": 1, "_id": 1})
    .then((categories) => {
      res.json({
        Items: categories,
        Count: categories.length,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
