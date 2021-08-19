const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Counter = require('./counters');

let commissionSchema = new Schema(
    {
        commissionRef: { type: String, trim: true, unique: true },

        itemType: { type: String, trim: true, required: true },
        itemId: { type: Schema.Types.ObjectId, required: true },
        chargeType: { type: String, trim: true, required: true }, // flat or percentage
        charge: { type: Number, required: true },
        
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }
);

// Sets the createdAt parameter equal to the current time
commissionSchema.pre('save', async function(next) {
    const commission = this;

    const now = new Date();
    if(!commission.createdAt) {
        commission.createdAt = now;
    }
    commission.updatedAt = now;

    if(!commission.commissionRef) {
        const commissionRef = await Counter.getNextSequence("commissionRef");
        commission.commissionRef = `COMMISSION${(commissionRef.toString()).padStart(10, '0')}`;
    }

    next();
});

commissionSchema.pre('updateOne', { document: true }, async function(query, next) {
    let commission = this;
    commission = commission._update;

    const now = new Date();
    if(!commission.createdAt) {
        commission.createdAt = now;
    }
    commission.updatedAt = now;

    next();
});

module.exports = mongoose.model('commission', commissionSchema);