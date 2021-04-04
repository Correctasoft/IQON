const express = require("express");
const router = express.Router();
const CategoryModel = require("../../../models/Category");
const ProductModel = require("../../../models/Product");
const {
  multipleMongooseToObj
} = require("../../../helpers/mongoobjecthelper");
const Product = require("../../../models/Product");

// const { userAuthentication } = require("../../helpers/authentication");

// need to add authentication later
router.all("/*", (req, res, next) => {
  next();
});

router.get("/", (req, res) => {
  var substring = "";
  if (req.query.$filter) {
    substring = req.query.$filter.split("'")[1];
  }
  if (Object.keys(req.query).length === 0) {
    ProductModel.find({
      IsDelete: false,
      $or: [{
        Code: {
          $regex: `${substring}`,
          $options: "i",
        },
        Name: {
          $regex: `${substring}`,
          $options: "i",
        }
      }, ],
    }).
    populate({
        path: 'Category',
        model: CategoryModel
      })
      .then((products) => {
        res.json({
          Items: products,
          Count: products.length,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    if (Object.keys(req.query).includes("$orderby")) {
      let sortingParameters = [];
      sortingParameters = req.query.$orderby.split(" ");
      ProductModel.count({
          IsDelete: false,
          $or: [{
            Code: {
              $regex: ".*" + substring + ".*",
              $options: "i",
            },
            Name: {
              $regex: ".*" + substring + ".*",
              $options: "i",
            }
          }, ],
        },
        function (err, count) {
          if (err) {
            console.log(err);
          } else {
            ProductModel.find({
                IsDelete: false,
                $or: [{
                  Code: {
                    $regex: ".*" + substring + ".*",
                    $options: "i",
                  },
                  Name: {
                    $regex: ".*" + substring + ".*",
                    $options: "i",
                  }
                }, ],
              }).sort([
                [sortingParameters[0], getOrdering(sortingParameters[1])]
              ])
              .limit(parseInt(req.query.$top))
              .skip(parseInt(req.query.$skip))
              .populate({
                path: 'Category',
                model: CategoryModel
              })
              .then((products) => {
                res.json({
                  Items: products,
                  Count: products.length,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
    } else {
      ProductModel.count({
          IsDelete: false,
          $or: [{
            Code: {
              $regex: ".*" + substring + ".*",
              $options: "i",
            },
            Name: {
              $regex: ".*" + substring + ".*",
              $options: "i",
            }
          }, ],
        },
        function (err, count) {
          if (err) {
            console.log(err);
          } else {
            ProductModel.find({
                IsDelete: false,
                $or: [{
                  Code: {
                    $regex: ".*" + substring + ".*",
                    $options: "i",
                  },
                  Name: {
                    $regex: ".*" + substring + ".*",
                    $options: "i",
                  }
                }, ],
              })
              .limit(parseInt(req.query.$top))
              .skip(parseInt(req.query.$skip))
              .populate({
                path: 'Category',
                model: CategoryModel
              })
              .then((products) => {
                res.json({
                  Items: products,
                  Count: products.length,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
    }
  }
});

router.put("/", (req, res) => {
  console.log(req.body);
  ProductModel.updateOne({
      _id: req.body.Product_id,
    }, {
      $set: {
        Name: req.body.ProductName,
        Code: req.body.ProductCode,
        Active: req.body.ProductActive,
        Description: req.body.ProductDescription,
        SellingPrice: req.body.ProductSellingPrice,
        DiscountedPrice: req.body.ProductDiscountedPrice,
        StockAvailable: req.body.ProductStockAvailable,
        MainImage: req.body.ProductImage,
        SecondaryImage: req.body.ProductImage1,
        IsFeatured: req.body.ProductFeatured,
        Category: req.body.ProductCategory,
        Size: req.body.ProductSize,
        Color: req.body.ProductColor,
        Tags: req.body.ProductTags,
        UpdationDate: Date.now(),
        //UpdatedBy: req.user._id
      },
    })
    .then((_) => {
      res.json({
        status: 200,
      });
    })
    .catch((err) => console.log(err));
});

router.post("/", async (req, res) => {
  const newProduct = new ProductModel({
    Name: req.body.ProductName,
    Code: req.body.ProductCode,
    Active: req.body.ProductActive,
    Description: req.body.ProductDescription,
    SellingPrice: req.body.ProductSellingPrice,
    DiscountedPrice: req.body.ProductDiscountedPrice,
    StockAvailable: req.body.ProductStockAvailable,
    MainImage: req.body.ProductImage,
    SecondaryImage: req.body.ProductImage1,
    IsFeatured: req.body.ProductFeatured,
    Category: req.body.ProductCategory,
    Size: req.body.ProductSize,
    Color: req.body.ProductColor,
    Tags: req.body.ProductTags,
    InsertionDate: Date.now(),
    //InsertedBy: req.user._id,
    UpdationDate: Date.now(),
    //UpdatedBy: req.user._id
  });
  await newProduct.save();
  res.json({
    status: 200,
  });
});

router.delete("/:id", (req, res) => {

  ProductModel.updateOne({
      _id: req.params.id
    }, {
      $set: {
        IsDelete: true,
      },
    }).then((_) => {
      res.json({
        status: 200,
      });
    })
    .catch((err) => console.log(err));
});

router.get('/parent-categories', (req, res) => {
  CategoryModel.find({
      Parent: null,
      IsDelete: false
    }).select({
      "Name": 1,
      "_id": 1
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

module.exports = router;