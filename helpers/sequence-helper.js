const { seq } = require("async");
const Sequence = require("../models/Sequence");

module.exports = {
  GetSequenceNextValue: async function (seqName) {
    var seqDoc = await Sequence.findOneAndUpdate(
      { Name: seqName },
      { $inc: { LastValue: 1 } },
      { new: true }
    );
    return seqDoc.LastValue;
  },
};
