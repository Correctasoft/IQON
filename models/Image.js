const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Content: {
    type: String,
  },
  Type: {
    type: String,
  },
  Product : {
    type : Schema.Types.ObjectId,
    ref : 'Product'
  },
  IsDelete:{
    type: Boolean,
    default : false
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
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = mongoose.model("Image", ImageSchema);