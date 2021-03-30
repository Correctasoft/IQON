const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  Owner: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  Quantity:{
    type: Number,
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

module.exports = mongoose.model("Cart", CartSchema);