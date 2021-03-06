const fs = require("fs");
const express = require("express");
const router = express.Router();
const CategoryModel = require("../../../models/Category");
const SaleCategoryModel = require("../../../models/SaleCategory");
const ProductModel = require("../../../models/Product");
const {
  multipleMongooseToObj
} = require("../../../helpers/mongoobjecthelper");
const Product = require("../../../models/Product");
const Jimp = require('jimp');

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
      },],
    }).select({
      MainImage: 0,
      SecondaryImage: 0,
    }).
      populate({
        path: 'Category',
        model: CategoryModel
      }
      ).populate({
        path: 'SaleCategory',
        model: SaleCategoryModel
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
        },],
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
              },],
            }).select({
              MainImage: 0,
              SecondaryImage: 0,
            })
              .sort([
                [sortingParameters[0], getOrdering(sortingParameters[1])]
              ])
              .limit(parseInt(req.query.$top))
              .skip(parseInt(req.query.$skip))
              .populate({
                path: 'Category',
                model: CategoryModel
              }).populate({
                path: 'SaleCategory',
                model: SaleCategoryModel
              })
              .then((products) => {
                res.json({
                  Items: products,
                  Count: count,
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
        },],
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
              },],
            })
              .select({
                MainImage: 0,
                SecondaryImage: 0,
              })
              .limit(parseInt(req.query.$top))
              .skip(parseInt(req.query.$skip))
              .populate({
                path: 'Category',
                model: CategoryModel
              }).populate({
                path: 'SaleCategory',
                model: SaleCategoryModel
              })
              .then((products) => {
                res.json({
                  Items: products,
                  Count: count,
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
  if (req.body.ProductImage1 && req.body.ProductImage && req.body.ProductImage.includes(';base64,') && req.body.ProductImage1.includes(';base64,')) {
    let base64Image = req.body.ProductImage.split(';base64,').pop();
    let image1type = req.body.ProductImage.split(';base64,')[0];
    let image2type = req.body.ProductImage1.split(';base64,')[0];
    fs.writeFile('image.png', base64Image, {
      encoding: 'base64'
    }, async function (err) {
      const image = await Jimp.read('image.png');
      await image.resize(800, 800);
      await image.quality(70);
      await image.writeAsync('image.png');
      let img1 = fs.readFileSync('image.png');
      let encode_image1 = img1.toString('base64');
      let base64Image2 = req.body.ProductImage1.split(';base64,').pop();
      fs.writeFile('image.png', base64Image2, {
        encoding: 'base64'
      }, async function (err) {
        const image2 = await Jimp.read('image.png');
        await image2.resize(800, 800);
        await image2.quality(70);
        await image2.writeAsync('image.png');
        let img2 = fs.readFileSync('image.png');
        let encode_image2 = img2.toString('base64');
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
            MainImage: image1type + ';base64,' + encode_image1,
            SecondaryImage: image2type + ';base64,' + encode_image2,
            IsFeatured: req.body.ProductFeatured,
            Category: req.body.ProductCategory,
            SaleCategory : req.body.ProductSaleCategory,
            Size: req.body.ProductSize,
            Color: req.body.ProductColor,
            Tags: req.body.ProductTags,
            UpdationDate: Date.now(),
            //UpdatedBy: req.user._id
          },
        })
          .then((_) => {
            fs.unlink('image.png', (err => {
              if (err) console.log(err);

            }));
            res.json({
              status: 200,
            });
          })
          .catch((err) => console.log(err));
      })
    })
  } else {
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
        IsFeatured: req.body.ProductFeatured,
        Category: req.body.ProductCategory,
        SaleCategory : req.body.ProductSaleCategory,
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
  }
});

router.post("/", async (req, res) => {
  if (req.body.ProductImage1 && req.body.ProductImage && req.body.ProductImage.includes(';base64,') && req.body.ProductImage1.includes(';base64,')) {
    let base64Image = req.body.ProductImage.split(';base64,').pop();
    let image1type = req.body.ProductImage.split(';base64,')[0];
    let image2type = req.body.ProductImage1.split(';base64,')[0];
    fs.writeFile('image.png', base64Image, {
      encoding: 'base64'
    }, async function (err) {
      const image = await Jimp.read('image.png');
      await image.resize(500, 500);
      await image.quality(70);
      await image.writeAsync('image.png');
      let img1 = fs.readFileSync('image.png');
      let encode_image1 = img1.toString('base64');
      let base64Image2 = req.body.ProductImage1.split(';base64,').pop();
      fs.writeFile('image.png', base64Image2, {
        encoding: 'base64'
      }, async function (err) {
        const image2 = await Jimp.read('image.png');
        await image2.resize(500, 500);
        await image2.quality(70);
        await image2.writeAsync('image.png');
        let img2 = fs.readFileSync('image.png');
        let encode_image2 = img2.toString('base64');
        const newProduct = new ProductModel({
          Name: req.body.ProductName,
          Code: req.body.ProductCode,
          Active: req.body.ProductActive,
          Description: req.body.ProductDescription,
          SellingPrice: req.body.ProductSellingPrice,
          DiscountedPrice: req.body.ProductDiscountedPrice,
          StockAvailable: req.body.ProductStockAvailable,
          MainImage: image1type + ';base64,' + encode_image1,
          SecondaryImage: image2type + ';base64,' + encode_image2,
          IsFeatured: req.body.ProductFeatured,
          Category: req.body.ProductCategory,
          SaleCategory : req.body.ProductSaleCategory,
          Size: req.body.ProductSize,
          Color: req.body.ProductColor,
          Tags: req.body.ProductTags,
          InsertionDate: Date.now(),
          //InsertedBy: req.user._id,
          UpdationDate: Date.now(),
          //UpdatedBy: req.user._id
        });
        await newProduct.save();
        fs.unlink('image.png', (err => {
          if (err) console.log(err);
          else {
          }
        }));
        res.json({
          status: 200,
        });
      });
    });
  } else {
    const newProduct = new ProductModel({
      Name: req.body.ProductName,
      Code: req.body.ProductCode,
      Active: req.body.ProductActive,
      Description: req.body.ProductDescription,
      SellingPrice: req.body.ProductSellingPrice,
      DiscountedPrice: req.body.ProductDiscountedPrice,
      StockAvailable: req.body.ProductStockAvailable,
      IsFeatured: req.body.ProductFeatured,
      Category: req.body.ProductCategory,
      SaleCategory : req.body.ProductSaleCategory,
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
  }
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

router.get('/mini-products', (req, res) => {
  ProductModel.find({
    IsDelete: false
  }).select({
    "Name": 1,
    "Code": 1,
    "_id": 1
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
});

router.get('/mainimage/:id', (req, res) => {
  let height = parseInt(req.query.height);
  let width = parseInt(req.query.width);
  let quantity = parseInt(req.query.quality);
  ProductModel.findOne({
    IsDelete: false,
    _id: req.params.id
  }).select({
    "MainImage": 1
  })
    .then((product) => {
      let base64Image = product.MainImage.split(';base64,').pop();
      fs.writeFile(req.params.id + 'image1.png', base64Image, {
        encoding: 'base64'
      }, async function (err) {
        const image = await Jimp.read(req.params.id + 'image1.png');
        await image.resize(width, height);
        await image.quality(quantity);
        await image.writeAsync(req.params.id + 'image1.png');
        let img1 = fs.readFileSync(req.params.id + 'image1.png');
        let encode_image1 = img1.toString('base64');
        var img = Buffer.from(encode_image1, "base64");
        fs.unlink(req.params.id + 'image1.png', (err => {
          if (err) console.log(err);
          else {
            res.writeHead(200, {
              "Content-Type": "image/png",
              "Content-Length": img.length,
            });
            res.end(img);
          }
        }));
      });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get('/seondaryimage/:id', (req, res) => {
  let height = parseInt(req.query.height);
  let width = parseInt(req.query.width);
  let quantity = parseInt(req.query.quality);
  ProductModel.findOne({
    IsDelete: false,
    _id: req.params.id
  }).select({
    "SecondaryImage": 1
  })
    .then((product) => {
      let base64Image = product.SecondaryImage.split(';base64,').pop();
      fs.writeFile(req.params.id + 'image2.png', base64Image, {
        encoding: 'base64'
      }, async function (err) {
        const image = await Jimp.read(req.params.id + 'image2.png');
        await image.resize(width, height);
        await image.quality(quantity);
        await image.writeAsync(req.params.id + 'image2.png');
        let img1 = fs.readFileSync(req.params.id + 'image2.png');
        let encode_image1 = img1.toString('base64');
        var img = Buffer.from(encode_image1, "base64");
        fs.unlink(req.params.id + 'image2.png', (err => {
          if (err) console.log(err);
          else {
            res.writeHead(200, {
              "Content-Type": "image/png",
              "Content-Length": img.length,
            });
            res.end(img);
          }
        }));
      });
    })
    .catch((err) => {
      console.log(err);
    });
});



module.exports = router;