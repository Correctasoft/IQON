const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { getLoggedInCustomer } = require('../../../middleware/web');
const productModel =  require('../../../models/Product');
const categoryModel =  require('../../../models/Category');
const { getCommonData  } = require('../../../middleware/web');
const fs = require("fs");
const Jimp = require('jimp');

router.get('/:slug', getCommonData, async (req, res)=>{
    let category = mongooseToObj(await categoryModel.findOne({Slug: req.params.slug}));
    let children = multipleMongooseToObj(await categoryModel.find({Parent: category._id, IsDelete: false}));
    for(let i=0; i<children.length; i++){
        children[i].product_count = await productModel.countDocuments({Category: children[i]._id});
    }
    return res.render('main/website/categorylist', {
        layout: 'website/base',
        title: 'Category',
        category,
        children
    });
});


router.get('/api/image/:id', async(req, res) => {
    let height = parseInt(req.query.height);
    let width = parseInt(req.query.width);
    let quality = parseInt(req.query.quality);
    categoryModel.findOne({
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
                await image.quality(quality);
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