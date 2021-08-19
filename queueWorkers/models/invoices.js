const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const chargesSchema = require('./chargesSchema');

let invoiceSchema = new Schema({
    bookedByUserId: { type: Schema.Types.ObjectId, required: true },
    licenseeId: { type: Schema.Types.ObjectId, required: true },

    invoiceNumber: { type: Number, unique: true },
    invoiceReference: { type: String, trim: true, unique: true },

    description: { type: String, trim: true },

    rentalPeriod: {
        type: {
            start: { type: Date, required: true },
            end: { type: Date, required: true }
        }
    },
    doChargeDLR: { type: Boolean, required: true },
    isPickUp: { type: Boolean, required: true }, // pickup OR door2door

    rentedItems: {
        type: [{
            itemType: { type: String, trim: true },
			itemId: { type: Schema.Types.ObjectId },
            units: { type: Number, default: 1 },
            totalCharges: {
                type: {
                    total: { type: Number },
                    rentalCharges: { type: Number },
                    dlrCharges: { type: Number },
                    t2yCommission: { type: Number },
                    discount: { type: Number },
                    lateFees: { type: Number },
                    cancellationCharges: { type: Number, default: 0 },
                    taxes: { type: Number, default: 0 }
                }
            },
        }]
    },
    total: { type: Number, default: 0 },
    charges: {
        type: chargesSchema
    },
    //-----------------------------------------------------------------------

    pickUpLocation: {
        type: {
            text: { type: String, required: true },
            pincode: { type: String, trim: true /* , required: true */ },
            location: {
                type: {
                    type: { type: String, trim: true, default: "Point" },
                    coordinates: { type: [Number], required: true }
                }
                /* ,
                required: true */
            }
        },
        required: true
    },
    isTrackingPickUp: { type: Boolean, default: false },
    pickUpEmployeeId: { type: Schema.Types.ObjectId },

    dropOffLocation: {
        type: {
            text: { type: String, trim: true, required: true },
            pincode: { type: String, trim: true, required: true },
            location: {
                type: {
                    type: { type: String, trim: true, default: "Point" },
                    coordinates: { type: [Number], required: true }
                },
                required: true
            }
        },
        required: true
    },
    isTrackingDropOff: { type: Boolean, default: false },
    dropOffEmployeeId: { type: Schema.Types.ObjectId },

    driverLicenseScan: {
        type: {
            contentType: {
                type: String, trim: true,
                required: [true, "Image of the Driving License is sent in an Invalid format"]
            },
            data: {
                type: String,
                required: [true, "Image of the Driving License is sent in an Invalid format"],
            }
        }
    },

    //-----------------------------------------------------------------------

    isApproved: { type: Number, default: 0 },
    invoiceKey: String,
    revisions: {
        type: [{
            revisionType: { type: String, trim: true, enum: ["rental", "reschedule", "extension", "cancellation"], default: "rental" },

            start: { type: Date, required: true },
            end: { type: Date, required: true },

            requestOn: { type: Date, required: true },
            requestUpdatedOn: { type: Date, required: true },

            isApproved: { type: Number, default: 0 },
            approvedBy: { type: String, trim: true, default: "licensee", enum: [ "licensee", "admin" ] },
            approvedById: { type: Schema.Types.ObjectId },
            approvedOn: { type: Date },

            charges: {
                type: chargesSchema
            },
            invoiceKey: String,
            //-----------------------------------------------------------------------
            
            paymentIntentId: { type: String, trim: true },
            paymentIntentClientSecret: { type: String, trim: true },
            paymentDate: { type: Date },
            paidAmount: { type: Number, default: 0 }
        }]
    },

    bookingId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    //-----------------------------------------------------------------------

    rentalStatus: {
        type: String, trim: true,
        default: "booked",
        lowercase: true,
        enum: ["booked", "approved", "dispatched", "return-started", "delivered", "returned"]
    },
    dispatchDate: { type: Date },
    deliveryDate: { type: Date },
    returnStartedDate: { type: Date },
    returnDate: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

invoiceSchema.pre('updateOne', { document: true }, async function(query, next) {
    let invoice = this;
    invoice = invoice._update;

    const now = new Date();
    invoice.updatedAt = now;
    next();
});

module.exports = mongoose.model('invoice', invoiceSchema);