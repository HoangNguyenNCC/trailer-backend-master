const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Counter = require('./counters');

let discountSchema = new Schema(
    {
        discountRef: { type: String, trim: true, unique: true },

        itemType: { type: String, trim: true, required: true },
        itemId: { type: Schema.Types.ObjectId, required: true },
        chargeType: { type: String, trim: true, required: true }, // flat or percentage
        charge: { type: Number, required: true },
        
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }
);

// Sets the createdAt parameter equal to the current time
discountSchema.pre('save', async function(next) {
    const discount = this;

    const now = new Date();
    if(!discount.createdAt) {
        discount.createdAt = now;
    }
    discount.updatedAt = now;

    if(!discount.discountRef) {
        const discountRef = await Counter.getNextSequence("discountRef");
        discount.discountRef = `DISCOUNT${(discountRef.toString()).padStart(10, '0')}`;
    }

    next();
});

discountSchema.pre('updateOne', { document: true }, async function(query, next) {
    let discount = this;
    discount = discount._update;

    const now = new Date();
    if(!discount.createdAt) {
        discount.createdAt = now;
    }
    discount.updatedAt = now;

    next();
});

module.exports = mongoose.model('discount', discountSchema);