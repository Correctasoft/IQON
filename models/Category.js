const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const CategorySchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  Slug : {
    type :String,
    slug: 'Name'
  },
  Image :{
    type : String
  },
  IsFeatured : {
    type: Boolean,
    default : false
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

module.exports = mongoose.model("Category", CategorySchema);