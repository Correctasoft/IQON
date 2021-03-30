const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductVariantSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Category: {
    type: Schema.Types.ObjectId,
    default: 'Category',
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

module.exports = mongoose.model("ProductVariant", ProductVariantSchema);