const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Counter = require('./counters');


let TrailerInsuranceSchema = new Schema({
    insuranceRef: { type: String, trim: true, unique: true },

    itemType: { type: String, trim: true, default: "trailer", enum: ["trailer", "upsellitem"] },
    itemId: { type: Schema.Types.ObjectId, required: true },
    licenseeId: { type: Schema.Types.ObjectId, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    document: {
        type: {
            contentType: {
                type: String, trim: true,
                required: [true, "Insurance document is sent in an Invalid format"]
            },
            data: {
                type: String,
                required: [true, "Insurance document is sent in an Invalid format"],
            },
            verified: { type: Boolean, default: false },
            accepted: { type: Boolean }
        },
        required: [true, "Insurance document is required"]
    }
});

// Sets the createdAt parameter equal to the current time
TrailerInsuranceSchema.pre('save', async function(next) {
    const trailerInsurance = this;

    const now = new Date();
    if (!trailerInsurance.createdAt) {
        trailerInsurance.createdAt = now;
    }
    trailerInsurance.updatedAt = now;

    if(!trailerInsurance.insuranceRef) {
        const insuranceRef = await Counter.getNextSequence("insuranceRef");
        trailerInsurance.insuranceRef = `INSURANCE${(insuranceRef.toString()).padStart(10, '0')}`;
    }

    next();
});

TrailerInsuranceSchema.pre('updateOne', { document: true }, async function(query, next) {
    let trailerInsurance = this;
    trailerInsurance = trailerInsurance._update;

    const now = new Date();
    if(!trailerInsurance.createdAt) {
        trailerInsurance.createdAt = now;
    }
    trailerInsurance.updatedAt = now;

    next();
});

TrailerInsuranceSchema.statics.getAllFieldsExceptFile = function() {
    return {    
        insuranceRef: 1,
        itemType: 1,
        itemId: 1,
        licenseeId: 1,
        issueDate: 1,
        expiryDate: 1,
        "document.verified": 1,
        "document.accepted": 1,

        /* 
        document: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerInsuranceSchema.statics.getAllUsefulFieldsExceptFile = function() {
    return {  
        insuranceRef: 1,  
        itemType: 1,
        itemId: 1,
        licenseeId: 1,
        issueDate: 1,
        expiryDate: 1,
        "document.verified": 1,
        "document.accepted": 1,

        /* 
        document: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerInsuranceSchema.statics.getAllFieldsWithExistsFile = function() {
    return {   
        insuranceRef: 1,
        itemType: 1,
        itemId: 1,
        licenseeId: 1,
        issueDate: 1,
        expiryDate: 1,
        "document.verified": 1,
        "document.accepted": 1,

        /* 
        document: 1, 
        */

        createdAt: 1,
        updatedAt: 1
    };
};

TrailerInsuranceSchema.statics.getAllFieldsSpecified = function(fieldsArray) {
    const fieldsObj = {};

    fieldsArray.forEach((fieldName) => {
        fieldsObj[fieldName] = 1;
    });

    return fieldsObj;
};

module.exports = mongoose.model('trailerinsurance', TrailerInsuranceSchema);