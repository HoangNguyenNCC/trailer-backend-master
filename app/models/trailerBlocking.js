const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Counter = require('./counters');

let TrailerBlockingSchema = new Schema({
    blockingRef: { type: String, trim: true, unique: true },

    items: {
        type: [{
            itemType: { type: String, trim: true, default: "trailer", enum: ["trailer", "upsellitem"] },
            itemId: { type: Schema.Types.ObjectId, required: true },
            units: { type: Number, default: 1 }
        }]
    },
    licenseeId: { type: Schema.Types.ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false }
});

// Sets the createdAt parameter equal to the current time
TrailerBlockingSchema.pre('save', async function(next) {
    const trailerBlocking = this;

    const now = new Date();
    if (!trailerBlocking.createdAt) {
        trailerBlocking.createdAt = now;
    }
    trailerBlocking.updatedAt = now;

    if(!trailerBlocking.blockingRef) {
        const blockingRef = await Counter.getNextSequence("blockingRef");
        trailerBlocking.blockingRef = `BLOCKING${(blockingRef.toString()).padStart(10, '0')}`;
    }

    next();
});

TrailerBlockingSchema.pre('updateOne', { document: true }, async function(query, next) {
    let trailerBlocking = this;
    trailerBlocking = trailerBlocking._update;

    const now = new Date();
    if(!trailerBlocking.createdAt) {
        trailerBlocking.createdAt = now;
    }
    trailerBlocking.updatedAt = now;

    next();
});


TrailerBlockingSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        blockingRef: 1,
        items: 1,
        licenseeId: 1,
        startDate: 1,
        endDate: 1,
        isDeleted: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerBlockingSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {    
        blockingRef: 1,
        items: 1,
        licenseeId: 1,
        startDate: 1,
        endDate: 1,
        isDeleted: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerBlockingSchema.statics.getAllFieldsWithExistsFile = function() {
    return {   
        blockingRef: 1,
        items: 1,
        licenseeId: 1,
        startDate: 1,
        endDate: 1,
        isDeleted: 1,

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerBlockingSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
    const fieldsObj = {};

    fieldsArray.forEach((fieldName) => {
        fieldsObj[fieldName] = 1;
    });

    return fieldsObj;
};

module.exports = mongoose.model('trailerblocking', TrailerBlockingSchema);