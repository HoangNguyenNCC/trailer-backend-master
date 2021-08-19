const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Counter = require('./counters');


let TrailerRatingsSchema = new Schema(
    {
        ratingsRef: { type: String, trim: true, unique: true },

        itemType: { type: String, trim: true, required: true },
        itemId: { type: Schema.Types.ObjectId, required: true },
        ratedByUserId: { type: Schema.Types.ObjectId, required: true },
        ratingValue: { type: Number, required: true },
        
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }
);

// Sets the createdAt parameter equal to the current time
TrailerRatingsSchema.pre('save', async function(next) {
    const rating = this;

    const now = new Date();
    if(!rating.createdAt) {
        rating.createdAt = now;
    }
    rating.updatedAt = now;

    if(!rating.ratingsRef) {
        const ratingsRef = await Counter.getNextSequence("ratingsRef");
        rating.ratingsRef = `RATING${(ratingsRef.toString()).padStart(10, '0')}`;
    }

    next();
});

TrailerRatingsSchema.pre('updateOne', { document: true }, async function(query, next) {
    let rating = this;
    rating = rating._update;

    const now = new Date();
    if(!rating.createdAt) {
        rating.createdAt = now;
    }
    rating.updatedAt = now;

    next();
});

TrailerRatingsSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        ratingsRef: 1,
        itemType: 1,
        itemId: 1,
        ratedByUserId: 1,
        ratingValue: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerRatingsSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {    
        ratingsRef: 1,
        itemType: 1,
        itemId: 1,
        ratedByUserId: 1,
        ratingValue: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerRatingsSchema.statics.getAllFieldsWithExistsFile = function() {
    return {   
        ratingsRef: 1,
        itemType: 1,
        itemId: 1,
        ratedByUserId: 1,
        ratingValue: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerRatingsSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
    const fieldsObj = {};

    fieldsArray.forEach((fieldName) => {
        fieldsObj[fieldName] = 1;
    });

    return fieldsObj;
};

module.exports = mongoose.model('trailerrating', TrailerRatingsSchema);