const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Counter = require('./counters');

let RentalItemTypeSchema = new Schema({
    rentalItemTypeRef: { type: String, trim: true, unique: true },

    name: {
        type: String, trim: true,
        required: [true, "Rental Item Type is required"],
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Rental Item Type should not be empty"
        }]
    },
    code: {
        type: String, trim: true,
        required: [true, "Rental Item Code is required"],
        unique: true,
        validate: [{
            validator: (value) => {
                return !validator.isEmpty(value)
            },
            message: "Rental Item Code should not be empty"
        }]
    },
    itemtype: {
        type: String, trim: true,
        enum: ["trailer", "upsellitem"],
        default: "trailer"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

RentalItemTypeSchema.pre('save', async function(next) {
    const rentalItem = this;

    const now = new Date();
    if (!rentalItem.createdAt) {
        rentalItem.createdAt = now;
    }
    rentalItem.updatedAt = now;

    if(!rentalItem.rentalItemTypeRef) {
        const rentalItemTypeRef = await Counter.getNextSequence("rentalItemTypeRef");
        rentalItem.rentalItemTypeRef = `RENTALITEMTYPE${(rentalItemTypeRef.toString()).padStart(10, '0')}`;
    }

    next();
});

RentalItemTypeSchema.pre('updateOne', { document: true }, async function(query, next) {
    let rentalItem = this;
    rentalItem = rentalItem._update;

    const now = new Date();
    if(!rentalItem.createdAt) {
        rentalItem.createdAt = now;
    }
    rentalItem.updatedAt = now;

    next();
});

module.exports = mongoose.model('rentalitemtypes', RentalItemTypeSchema);