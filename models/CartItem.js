const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  Cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  },
  Product:{
    type: Schema.Types.ObjectId,
    ref: 'Product'
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

module.exports = mongoose.model("CartItem", CartItemSchema);