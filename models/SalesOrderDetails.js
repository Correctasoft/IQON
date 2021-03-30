const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesOrderDetailSchema = new Schema({
  Number: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  SubTotal: {
    type: Number,
    required: true,
  },
  Product: {
    type: Schema.Types.ObjectId,
    default: 'Product',
  },
  SalesOrder: {
    type: Schema.Types.ObjectId,
    default: 'SalesOrder',
  },
  UpdationDate: {
    type: Date,
    default: Date.now(),
  },
  InsertedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  UpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = mongoose.model("SalesOrderDetail", SalesOrderDetailSchema);