const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const ProductSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Code: {
    type: String,
    required: true
  },
  Active: {
    type: Boolean,
    default: true
  },
  Slug : {
    type :String,
    slug: ['Name','Code']
  },
  Description: {
    type: String,
  },
  Size: {
    type: String,
  },
  Color: {
    type: String,
  },
  Tags: {
    type: String,
  },
  SellingPrice: {
    type: Number,
    default: 0
  },
  DiscountedPrice: {
    type: Number,
    default: 0
  },
  StockAvailable: {
    type: Boolean,
    default: false
  },
  MainImage: {
    type: String,
    required: true
  },
  SecondaryImage: {
    type: String,
    //required: true
  },
  IsDelete:{
    type: Boolean,
    default : false
  },
  IsFeatured:{
    type: Boolean,
    default: false,
  },
  Category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
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

module.exports = mongoose.model("Product", ProductSchema);