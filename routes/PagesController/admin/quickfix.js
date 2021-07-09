const express = require("express");
const router = express.Router();
const { multipleMongooseToObj, mongooseToObj } = require("../../../helpers/mongoobjecthelper");
const { userAuthentication, getLoggedInUser } = require("../../../helpers/authentication");
const ProductModel = require("../../../models/Product");
const CategoryModel = require("../../../models/Category");

router.get('/', userAuthentication, async (req, res) => {
    try {
        let products = await ProductModel.find({IsDelete: false});
        for(let i=0; i<products.length; i++){
            console.log(products[i]._id);
            await ProductModel.updateOne({_id: products[i]._id},{
                $set:{
                    Slug: products[i].Code
                }
            })
        }
        res.json({"message":"Done !"});
      }
      catch(err) {
        res.json({"message":"Error !"});
      }
});

function getAllIndexes(arr, target) {
    var indexes = [], i = 0;
    for(i=0; i<arr.length; i++){
        console.log(arr[i].Slug , target.Slug , arr[i]._id , target._id);
        if(arr[i].Slug == target.Slug && arr[i]._id != target._id ){
            indexes.push(i);
        }
        
    }
    console.log('------');
    return indexes;
}

router.get('/fix-category-slug', userAuthentication, async (req, res) => {
    try {
        let categories = multipleMongooseToObj(await CategoryModel.find({IsDelete: false}).select('Slug'));
        for(let i=0; i<categories.length; i++){
            var indexes = getAllIndexes(categories, categories[i]);
            console.log(indexes);
            for(let j=0; j<indexes.length; j++){
                categories[indexes[j]].Slug = categories[indexes[j]].Slug+"-"+(j+1);
                await CategoryModel.updateOne({_id: categories[indexes[j]].id},{
                     $set:{
                         Slug: categories[indexes[j]].Slug
                    }
                });
            }
            
        }
        res.json({"message":"Done !"});
      }
      catch(err) {
        res.json({"message":"Error !"});
      }
});

module.exports = router;