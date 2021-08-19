const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cartSchema = new Schema({
    cartItems: {
        type: [{
            itemId: { type: Schema.Types.ObjectId, required: true },
            total: { type: Number, required: true },
            isRemoved: { type: Boolean, default: false }
        }]
    },
    total: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    accessCode: { type: String, trim: true },

    
    transactionIdAuth: { type: String, trim: true },
    transactionActionAuth: { type: String, trim: true, lowercase: true, default: "capture", enum: ["capture", "cancel"] },
    transactionIdActionAuth: { type: String, trim: true },

    bookedByUserId: { type: Schema.Types.ObjectId, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

cartSchema.pre('save', async function(next) {
    const cart = this;

    const now = new Date();
    if (!cart.createdAt) {
        cart.createdAt = now;
    }
    cart.updatedAt = now;

    next();
});


module.exports = mongoose.model('cart', cartSchema);