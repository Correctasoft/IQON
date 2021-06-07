var express = require('express');
var router = express.Router();
const OutletModel= require('../../../models/Outlet');

router.get('/', (req, res) => {
    OutletModel.find({}).then(outlets=>{
        res.json({
            Items: outlets,
            Count: outlets.length,
        });
    });
});

router.post('/', (req, res) => {
  const newOutlet = new OutletModel({
    City: req.body.outletCity,
    Address: req.body.outletAddress,
    Phone: req.body.outletPhone,
    Timing: req.body.outletTiming,
    GoogleMapUrl: req.body.outletGoogleMapUrl,
  });
  newOutlet
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
    OutletModel.updateOne(
    {
        _id: req.body.outlet_id,
    },
    {
        $set: {
          City: req.body.outletCity,
          Address: req.body.outletAddress,
          Phone: req.body.outletPhone,
          Timing: req.body.outletTiming,
          GoogleMapUrl: req.body.outletGoogleMapUrl,
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
    OutletModel.findOne({
      _id: req.params.id,
    }).then((outlet) => {
        outlet.delete();
        res.json({
            status: 200,
        });
    });
  });

module.exports = router;