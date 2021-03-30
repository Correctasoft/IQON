const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderedItemSchema = new Schema({
  Order: {
    type: Schema.Types.ObjectId,
    ref: 'SalesOrder'
  },
  Product:{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  Customer:{
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  Quantity:{
    type: Number,
  },
  Size:{
    type: String,
    default: null
  },
  Color:{
    type: String,
    default: null
  },
  Price:{
    type: Number
  },
  Total:{
    type: Number,
  },
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = mongoose.model("OrderedItem", OrderedItemSchema);