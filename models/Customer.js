const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
  },
  Phone: {
    type: String,
  },
  Email: {
    type: String,
  },
  Address: {
    type: String,
  },
  City:{
    type: String,
  },
  Area:{
    type: String,
  },
  Postalcode:{
    type: Number,
  },
  Password: {
    type: String,
  },
  NumberOfOrders:{
    type: Number,
    default: 0
  },
  IsDelete:{
    type: Boolean,
    default: false
  },
  InsertionDate: {
    type: Date,
    default: Date.now(),
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
});

module.exports = mongoose.model("Customer", CustomerSchema);
