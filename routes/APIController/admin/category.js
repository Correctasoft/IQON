const express = require("express");
const fs = require("fs");
const router = express.Router();
const CategoryModel = require("../../../models/Category");
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
  CategoryModel.find({
      IsDelete: false
    }).populate({
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
  let base64Image = req.body.categoryImage.split(';base64,').pop();
  let image1type = req.body.categoryImage.split(';base64,')[0];
  fs.writeFile('image.png', base64Image, {
    encoding: 'base64'
  }, async function (err) {
    const image = await Jimp.read('image.png');
    await image.resize(800, 800);
    await image.quality(70);
    await image.writeAsync('image.png');
    let img1 = fs.readFileSync('image.png');
    let encode_image1 = img1.toString('base64');
    CategoryModel.updateOne({
        _id: req.body.category_id,
      }, {
        $set: {
          Name: req.body.categoryName,
          Image: image1type + ';base64,' + encode_image1,
          Parent: req.body.categoryParent,
          IsFeatured: req.body.categoryIsFeatured,
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
  let base64Image = req.body.categoryImage.split(';base64,').pop();
  let image1type = req.body.categoryImage.split(';base64,')[0];
  fs.writeFile('image.png', base64Image, {
    encoding: 'base64'
  }, async function (err) {
    const image = await Jimp.read('image.png');
    await image.resize(800, 800);
    await image.quality(70);
    await image.writeAsync('image.png');
    let img1 = fs.readFileSync('image.png');
    let encode_image1 = img1.toString('base64');
    const newCategory = new CategoryModel({
      Name: req.body.categoryName,
      Image: image1type + ';base64,' + encode_image1,
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
  })
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
  CategoryModel.updateOne({
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

router.get('/mini-categories', (req, res) => {
  CategoryModel.find({
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