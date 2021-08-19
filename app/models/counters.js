const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dotenv = require('dotenv');
dotenv.config();
const config = process.env;


let countersSchema = new Schema(
    {
        _id: { type: String, trim: true },
        seq: { type: Number, default: 0 }
    }
);

countersSchema.statics.getNextSequence = async function(name) {
    const Counter = this;
    const modifiedCounter = await Counter.updateOne(
        { _id: name },
        { $inc: { seq: 1 } },
        { upsert: true }
    );
    const counter = await Counter.findOne({ _id: name }, { seq: 1 });

    return counter.seq;
};

module.exports = mongoose.model('counters', countersSchema);