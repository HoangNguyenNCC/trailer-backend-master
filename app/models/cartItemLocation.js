const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Counter = require('./counters');

let cartItemLocationSchema = new Schema({
    rentalId: { type: Schema.Types.ObjectId, required: true },
    location: { type: [Number], required: true },

    createdAt: { type: Date, default: Date.now }
});


// Sets the createdAt parameter equal to the current time
cartItemLocationSchema.pre('save', async function(next) {
    const rental = this;

    const now = new Date();
    if (!rental.createdAt) {
        rental.createdAt = now;
    }
    rental.updatedAt = now;

    next();
});

cartItemLocationSchema.pre('updateOne', { document: true }, async function(query, next) {
    let rental = this;
    rental = rental._update;

    const now = new Date();
    if(!rental.createdAt) {
        rental.createdAt = now;
    }
    rental.updatedAt = now;

    next();
});

module.exports = mongoose.model('cartItemLocation', cartItemLocationSchema);