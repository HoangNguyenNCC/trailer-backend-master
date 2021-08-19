const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Counter = require('./counters');


let TrailerReviewsSchema = new Schema(
    {
        reviewsRef: { type: String, trim: true, unique: true },

        itemType: { type: String, trim: true, required: true },
        itemId: { type: Schema.Types.ObjectId, required: true },
        reviewedByUserId: { type: Schema.Types.ObjectId, required: true },
        reviewText: { type: String, trim: true, required: true },
        
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }
);

// Sets the createdAt parameter equal to the current time
TrailerReviewsSchema.pre('save', async function(next) {
    const review = this;

    const now = new Date();
    if(!review.createdAt) {
        review.createdAt = now;
    }
    review.updatedAt = now;

    if(!review.reviewsRef) {
        const reviewsRef = await Counter.getNextSequence("reviewsRef");
        review.reviewsRef = `REVIEW${(reviewsRef.toString()).padStart(10, '0')}`;
    }

    next();
});

TrailerReviewsSchema.pre('updateOne', { document: true }, async function(query, next) {
    let review = this;
    review = review._update;

    const now = new Date();
    if(!review.createdAt) {
        review.createdAt = now;
    }
    review.updatedAt = now;

    next();
});

TrailerReviewsSchema.statics.getAllFieldsExceptFile = function() {
    return { 
        reviewsRef: 1,   
        itemType: 1,
        itemId: 1,
        reviewedByUserId: 1,
        reviewText: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerReviewsSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {    
        reviewsRef: 1,  
        itemType: 1,
        itemId: 1,
        reviewedByUserId: 1,
        reviewText: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerReviewsSchema.statics.getAllFieldsWithExistsFile = function() {
    return {   
        reviewsRef: 1,  
        itemType: 1,
        itemId: 1,
        reviewedByUserId: 1,
        reviewText: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerReviewsSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
    const fieldsObj = {};

    fieldsArray.forEach((fieldName) => {
        fieldsObj[fieldName] = 1;
    });

    return fieldsObj;
};

module.exports = mongoose.model('trailerreview', TrailerReviewsSchema);