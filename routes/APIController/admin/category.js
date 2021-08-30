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
    }).select({
      Image: 0,
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

  if (req.body.categoryImage && req.body.categoryImage.includes(';base64,')) {
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
    });
  }
  else{
    CategoryModel.updateOne({
      _id: req.body.category_id,
    }, {
      $set: {
        Name: req.body.categoryName,
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
  }
  
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
  /*CategoryModel.findOne({
    _id: req.params.id,
  }).then((category) => {
    category.delete();
    res.json({
      status: 200,
    });
  });*/
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

router.get('/image/:id', (req, res) => {
  let height = parseInt(req.query.height);
  let width = parseInt(req.query.width);
  let quantity = parseInt(req.query.quality);
  CategoryModel.findOne({
    IsDelete: false,
    _id: req.params.id
  }).select({
    "Image": 1
  })
    .then((category) => {
      let base64Image = category.Image.split(';base64,').pop();
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

module.exports = router;