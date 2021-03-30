const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SequenceSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    LastValue: {
      type: Number,
      default: 0,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);
module.exports = mongoose.model("Sequence", SequenceSchema);
