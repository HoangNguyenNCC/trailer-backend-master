const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Counter = require('./counters');


let TrailerServicingSchema = new Schema({
    servicingRef: { type: String, trim: true, unique: true },

    itemType: { type: String, trim: true, default: "trailer", enum: ["trailer", "upsellitem"] },
    itemId: { type: Schema.Types.ObjectId, required: true },
    licenseeId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, trim: true, required: true },
    serviceDate: { type: Date, required: true },
    nextDueDate: { type: Date },
    document: {
        type: {
            contentType: {
                type: String, trim: true,
                required: [true, "Servicing document is sent in an Invalid format"]
            },
            data: {
                type: String,
                required: [true, "Servicing document is sent in an Invalid format"],
            },
            verified: { type: Boolean, default: false },
            accepted: { type: Boolean }
        },
        required: [true, "Servicing document is required"]
    }
});

// Sets the createdAt parameter equal to the current time
TrailerServicingSchema.pre('save', async function(next) {
    const trailerServicing = this;

    const now = new Date();
    if (!trailerServicing.createdAt) {
        trailerServicing.createdAt = now;
    }
    trailerServicing.updatedAt = now;

    if(!trailerServicing.servicingRef) {
        const servicingRef = await Counter.getNextSequence("servicingRef");
        trailerServicing.servicingRef = `SERVICING${(servicingRef.toString()).padStart(10, '0')}`;
    }

    next();
});

TrailerServicingSchema.pre('updateOne', { document: true }, async function(query, next) {
    let trailerServicing = this;
    trailerServicing = trailerServicing._update;

    const now = new Date();
    if(!trailerServicing.createdAt) {
        trailerServicing.createdAt = now;
    }
    trailerServicing.updatedAt = now;

    next();
});

TrailerServicingSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        servicingRef: 1,
        itemType: 1,
        itemId: 1,
        licenseeId: 1,
        name: 1,
        serviceDate: 1,
        nextDueDate: 1,
        "document.verified": 1,
        "document.accepted": 1,

        /* 
        document: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerServicingSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {  
        servicingRef: 1,  
        itemType: 1,
        itemId: 1,
        licenseeId: 1,
        name: 1,
        serviceDate: 1,
        nextDueDate: 1,
        "document.verified": 1,
        "document.accepted": 1,

        /* 
        document: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerServicingSchema.statics.getAllFieldsWithExistsFile = function() {
    return {   
        servicingRef: 1,
        itemType: 1,
        itemId: 1,
        licenseeId: 1,
        name: 1,
        serviceDate: 1,
        nextDueDate: 1,
        "document.verified": 1,
        "document.accepted": 1,

        /* 
        document: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerServicingSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
    const fieldsObj = {};

    fieldsArray.forEach((fieldName) => {
        fieldsObj[fieldName] = 1;
    });

    return fieldsObj;
};

module.exports = mongoose.model('trailerservicing', TrailerServicingSchema);