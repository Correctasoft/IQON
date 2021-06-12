const express = require("express");
const fs = require("fs");
const router = express.Router();
const SaleCategoryModel = require("../../../models/SaleCategory");
const {
  multipleMongooseToObj
} = require("../../../helpers/mongoobjecthelper");
const Jimp = require('jimp');

// const { userAuthentication } = require("../../helpers/authentication");

// need to add authentication later
router.all("/*", (req, res, next) => {
  next();
});

router.get("/", (req, res) => {
  SaleCategoryModel.find({
      IsDelete: false
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
  let base64Image = req.body.SaleCategoryImage.split(';base64,').pop();
  let image1type = req.body.SaleCategoryImage.split(';base64,')[0];
  fs.writeFile('image.png', base64Image, {
    encoding: 'base64'
  }, async function (err) {
    const image = await Jimp.read('image.png');
    await image.resize(800, 800);
    await image.quality(70);
    await image.writeAsync('image.png');
    let img1 = fs.readFileSync('image.png');
    let encode_image1 = img1.toString('base64');
    SaleCategoryModel.updateOne({
        _id: req.body.SaleCategory_id,
      }, {
        $set: {
          Name: req.body.SaleCategoryName,
          Image: image1type + ';base64,' + encode_image1,
          IsFeatured: req.body.SaleCategoryIsFeatured,
        },
      })
      .then((_) => {
        res.json({
          status: 200,
        });
      })
      .catch((err) => console.log(err));
  })
});

router.post("/", (req, res) => {
  let base64Image = req.body.SaleCategoryImage.split(';base64,').pop();
  let image1type = req.body.SaleCategoryImage.split(';base64,')[0];
  fs.writeFile('image.png', base64Image, {
    encoding: 'base64'
  }, async function (err) {
    const image = await Jimp.read('image.png');
    await image.resize(800, 800);
    await image.quality(70);
    await image.writeAsync('image.png');
    let img1 = fs.readFileSync('image.png');
    let encode_image1 = img1.toString('base64');
    const newSaleCategory = new SaleCategoryModel({
      Name: req.body.SaleCategoryName,
      Image: image1type + ';base64,' + encode_image1,
      IsFeatured: req.body.SaleCategoryIsFeatured,
    });
    newSaleCategory
      .save()
      .then((savedSaleCategory) => {
        res.json({
          status: 200,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
});

router.delete("/:id", (req, res) => {
  SaleCategoryModel.updateOne({
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

router.get('/mini-categories', (req, res) => {
  SaleCategoryModel.find({
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