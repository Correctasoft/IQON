const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesOrderSchema = new Schema({
  Customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  Number: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Status: { //Pending, Processing ,Deivered, Rejected
    type: String,
    required: true,
  },
  Total: {
    type: Number,
    required: true,
  },
  Quantity:{
    type: Number,
  },
  PaymentMethod: {
    type: String,
    required: true,
  },
  CustomerName: {
    type: String,
    required: true,
  },
  CustomerPhone: {
    type: String,
    required: true,
  },
  CustomerEmail: {
    type: String,
  },
  BillingAddress: {
    type: String,
    required: true,
  },
  BillingCity:{
    type: String,
    required: true,
  },
  BillingArea:{
    type: String,
    required: true,
  },
  BillingPostalcode:{
    type: Number,
    required: true,
  },
  Note:{
    type: String
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

module.exports = mongoose.model("SalesOrder", SalesOrderSchema);