const express = require("express");
const router = express.Router();
const customerModel = require('../../../models/Customer');
const fs = require('fs');
const excel = require('exceljs');
const {
  multipleMongooseToObj
} = require("../../../helpers/mongoobjecthelper");

// const { userAuthentication } = require("../../helpers/authentication");

// need to add authentication later
router.all("/*", (req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  let customerList = multipleMongooseToObj(await customerModel.find({
    IsDelete: false
  },{"Name":1,"Email":1,"Phone":1,"NumberOfOrders":1,"_id":0}));
  if (customerList.length > 0) {
    if (fs.existsSync("customer.xlsx")) {
      try {
        fs.unlinkSync("customer.xlsx")
        //file removed
      } catch (err) {
        console.error(err)
      }
    }
    let workbook = new excel.Workbook(); //creating workbook
    let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
    //  WorkSheet Header
    let columns = [];
    let keys = Object.keys(customerList[0]).filter(m=>!columns.includes(m));
    for (let i = 0; i < keys.length; i++) {
      columns.push({
        header: keys[i],
        key: keys[i],
        width: 30
      });
    }
    worksheet.columns = columns;
    worksheet.addRows(customerList);

    workbook.xlsx.writeFile("customer.xlsx")
      .then(function () {
        res.download("customer.xlsx", function (error) {
          console.log(error)
        });
      }).catch(err => {
        console.log(err);
      });


    // const json2csvParser = new Json2csvParser({
    //   header: true
    // });
    // const csvData = json2csvParser.parse(customerList);

    // fs.writeFile("customers.csv", csvData, function (error) {
    //   if (error) throw error;
    //   res.download("customer.csv", function (error) {
    //     console.log("Error : ", error)
    //   });
    // });
  } else {
    res.json({
      Message: "No Data Found"
    });
  }
});

module.exports = router;