const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockItemSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Quantity:{
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
},
{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = mongoose.model("StockItem", StockItemSchema);
