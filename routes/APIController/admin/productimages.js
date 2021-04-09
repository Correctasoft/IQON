const express = require("express");
const router = express.Router();
const CategoryModel = require("../../../models/Category");
const ProductModel = require("../../../models/Product");
const ImageModel = require("../../../models/Image");
const fs = require('fs');
const store = require('../../../middleware/multer');
const Jimp = require('jimp');

const {
  multipleMongooseToObj
} = require("../../../helpers/mongoobjecthelper");
const {userAuthentication} = require('../../../helpers/authentication');

// need to add authentication later
router.all('/*', (req, res, next) => {
  next();
});
router.get("/", (req, res) => {
  ProductModel.find({
    IsDelete: false
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
});



router.get("/getproductimages/:id", async (req, res) => {
  try {
    let images = await ImageModel.find({
      Product: req.params.id
    });
    res.json(images);
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete", (req, res) => {
  ImageModel.updateOne({
      _id: req.body.id
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


router.put("/", (req, res) => {
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

router.post("/:id",store.array('images', 12)  , async (req, res, next) => {
  const files = req.files;
  const productId = req.params.id;
  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error)
  }
  files.map(async file => {
    const image = await Jimp.read(file.path);
    await image.resize(800, 800);
    await image.quality(70);
    await image.writeAsync(file.path);
  })
  // convert images into base64 encoding
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path)
    return encode_image = img.toString('base64')
  })

  let result = imgArray.map((src, index) => {

    // create object to store data in the collection
    let imageObject = {
      Name: files[index].originalname,
      Type: files[index].mimetype,
      Content: src,
      Product: productId
    }

    let newUpload = new ImageModel(imageObject);

    return newUpload
      .save()
      .then(() => {

        return {
          msg: `${files[index].originalname} Uploaded Successfully...!`
        }
      })
      .catch(error => {
        if (error) {
          if (error.name === 'MongoError' && error.code === 11000) {
            return Promise.reject({
              error: `Duplicate ${files[index].originalname}. File Already exists! `
            });
          }
          return Promise.reject({
            error: error.message || `Cannot Upload ${files[index].originalname} Something Missing!`
          })
        }
      })
  });
  

  Promise.all(result)
    .then(msg => {
      for(let i=0;i<files.length;i++){
        fs.unlinkSync(files[i].path);
      }
      // res.json(msg);
      res.redirect('/admin/productimages');
    })
    .catch(err => {
      res.json(err);
    })
});

module.exports = router;