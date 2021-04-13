const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  Review: {
    type: String,
    required: true,
  },
  Customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  Product: {
    type: Schema.Types.ObjectId,
    default: 'Product',
  },
  IsAuthorized:{
    type: Boolean,
    default: false
  },
  InsertionDate: {
    type: Date,
    default: Date.now(),
  },
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);