const express = require("express");
const router = express.Router();
const StockModel = require('../../models/StockItem');
const { multipleMongooseToObj } = require("../../helpers/mongoobjecthelper");

router.get('/', async (req, res) => {
    let stockList = await StockModel.find({IsDelete : false});
    return res.render('main/stock/index', {
        layout: 'admin/base',
        title: 'Stock Items',
        stockList: multipleMongooseToObj(stockList)
    });
});

router.post('/', (req, res) => {
    let newStock = new StockModel({
        Name: req.body.stock_name,
    });
    newStock.save().then((_)=>{
        res.redirect('/stock');
    });
});

router.post('/delete', async (req, res) => {
    await StockModel.updateMany({
        _id: req.body.stock_id,
    },
    {
        $set: {
            IsDelete: true,
        },
    });
    res.redirect('/stock');
});

router.post('/edit', async (req, res) => {
    await StockModel.updateOne({_id : req.body.stock_id},{
        $set:{
            Name: req.body.stock_name,
        }
    });

    res.redirect('/stock');
});

module.exports = router;