const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    Title: {
        type: String,
        required: true,
    },
    Image: {
        type: String
    },
    Url: {
        type: String,
    },
    Order: {
        type: Number
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

module.exports = mongoose.model("Banner", BannerSchema);