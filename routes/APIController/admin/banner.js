var express = require('express');
var router = express.Router();
const BannerModel= require('../../../models/Banner');

router.get('/', (req, res) => {
    BannerModel.find({}).then(banners=>{
        res.json({
            Items: banners,
            Count: banners.length,
        });
    });
});

router.post('/', (req, res) => {
  const newBanner = new BannerModel({
    Title: req.body.bannerTitle,
    Image: req.body.bannerImage,
    Url: req.body.bannerUrl,
    Order: req.body.bannerOrder,
  });
  newBanner
    .save()
    .then((_) => {
      res.json({
        status: 200,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put('/', (req, res) => {
    BannerModel.updateOne(
    {
        _id: req.body.banner_id,
    },
    {
        $set: {
            Title: req.body.bannerTitle,
            Image: req.body.bannerImage,
            Url: req.body.bannerUrl,
            Order: req.body.bannerOrder,
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

router.delete("/:id", (req, res) => {
    BannerModel.findOne({
      _id: req.params.id,
    }).then((banner) => {
        banner.delete();
        res.json({
            status: 200,
        });
    });
  });

module.exports = router;