const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliveryChargeSchema = new Schema({
  Amount: {
    type: String,
    required: true,
  },
  Label : {
    type : String
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

module.exports = mongoose.model("DeliveryCharge", DeliveryChargeSchema);