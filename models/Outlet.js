const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OutletSchema = new Schema({
    City: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    Phone: {
        type: String,
    },
    Timing: {
        type: String,
    },
    GoogleMapUrl: {
        type: String,
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

module.exports = mongoose.model("Outlet", OutletSchema);