const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rapid = require('eway-rapid');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const compareValues = require('../helpers/compareValues');
const constants = require('../helpers/constants');


let cartItemSchema = new Schema({
    transactionType: { type: String, trim: true, required: true }, // rent or buy
    rentedItem: { type: String, trim: true, required: true }, // trailer or upsellitem
    rentedItemId: { type: Schema.Types.ObjectId, required: true }, // trailerId or upsellItemId

    bookedByUserId: { type: Schema.Types.ObjectId, required: true },
    licenseeId: { type: Schema.Types.ObjectId, required: true },
    cartId: { type: Schema.Types.ObjectId, required: true },

    units: { type: Number },

    rentalPeriod: {
        type: {
            start: { type: Date, required: true },
            end: { type: Date, required: true }
        }
    },

    scheduleLog: {
        type: [{
            start: { type: Date, required: true },
            end: { type: Date, required: true },
            requestOn: { type: Date, required: true },
            requestUpdatedOn: { type: Date, required: true },
            isApproved: { type: Boolean, default: false },
            approvedOn: { type: Date }
        }]
    },

    extension: {
        type: [{
            extendTill: { type: Date, required: true },
            requestOn: { type: Date, required: true },
            requestUpdatedOn: { type: Date, required: true },
            isApproved: { type: Boolean, default: false },
            approvedOn: { type: Date }
        }]
    },

    rentalCharges: {
        type: {
            pickUp: [{
                type: {
                    duration: { type: Number, required: true, min: 1 },
                    charges: { type: Number, required: true, min: 1 }
                }
            }],
            door2Door: [{
                type: {
                    duration: { type: Number, required: true, min: 1 },
                    charges: { type: Number, required: true, min: 1 }
                }
            }],
        }
    },

    salesCharges: {
        type: {
            units: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 1 }
        }
    },

    totalCharges: {
        type: {
            total: { type: Number },
            rentalCharges: { type: Number },
            dlrCharges: { type: Number },
            t2yCommission: { type: Number },
            discount: { type: Number },
            lateFees: { type: Number },
            cancellationCharges: { type: Number, default: 0 },
            taxes: { type: Number }
        }
    },

    totalPaid: { type: Number, default: 0 },

    transactionIdAuth: { type: String, trim: true },
    transactionAuthDate: { type: Date },
    
    authTransactionAction: { type: String, trim: true, lowercase: true, enum: ["capture", "cancel"] },
    transactionIdAction: { type: String, trim: true },
    transactionActionDate: { type: Date },

    accessCode: { type: String, trim: true },
    formUrl: { type: String, trim: true },
    
    doChargeDLR: { type: Boolean, required: true },
    hireType: { type: String, trim: true, required: true }, // regular OR oneway
    isPickUp: { type: Boolean, required: true }, // pickup OR door2door

    pickUpLocation: {
        type: {
            text: { type: String, trim: true, required: true },
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

    pickUpEmployeeId: { type: Schema.Types.ObjectId },
    dropOffEmployeeId: { type: Schema.Types.ObjectId },

    isApproved: { type: Boolean, default: false },
    approvedBy: { type: String, trim: true, lowercase: true, default: "licensee", enum: [ "licensee", "admin" ] },
    approvedById: { type: Schema.Types.ObjectId },
    approvedOn: { type: Date },

    rentalStatus: {
        type: String, trim: true, lowercase: true,
        default: "booked",
        enum: ["booked", "approved", "dispatched", "return-started", "delivered", "returned"]
    },
    dispatchDate: {
        type: Date
    },
    deliveryDate: {
        type: Date
    },
    returnStartedDate: {
        type: Date
    },
    returnDate: {
        type: Date
    },

    cancellation: {
        type: {
            canceledByType: { type: String, trim: true, required: true }, // "user" or "licensee"
            canceledBy: { type: Schema.Types.ObjectId, required: true },
            isCanceled: { type: Boolean, required: true },
            canceledOn: { type: Date, required: true }
        }
    },

    isDriverLicenseVerified: { type: Boolean },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
cartItemSchema.pre('save', async function(next) {
    const rental = this;

    const now = new Date();
    if (!rental.createdAt) {
        rental.createdAt = now;
    }
    rental.updatedAt = now;

    next();
});

cartItemSchema.statics.preAuthorizeTransaction = async function(customerToken, rentalTotal) {
    try {
        const client = rapid.createClient(config.PAY_API_KEY, config.PAY_API_PASS, config.PAY_API_ENDPOINT);
        /* const transactionRes = await client.createTransaction(rapid.Enum.Method.DIRECT, {
            "Customer": {
                "TokenCustomerID": customerToken,
            },
            "Payment": {
                "TotalAmount": rentalTotal
            },
            "CardDetails": {
                "CVN": 643
            },
            "TransactionType": "Purchase",
            "Method": "Authorise"
        }); */

        const transactionRes = await client.createTransaction(rapid.Enum.Method.TRANSPARENT_REDIRECT, {
            "Customer": {
                "TokenCustomerID": customerToken,
            },
            "Payment": {
                "TotalAmount": rentalTotal
            },
            "RedirectUrl": `${config.HOST}/paymentsuccess`,
            "TransactionType": "Purchase",
            "Capture": false
        });

        const errors = transactionRes.getErrors();
        if (errors.length === 0) {
            const accessCode = transactionRes.get('AccessCode');
            const formUrl = transactionRes.get('FormActionURL');

            return {
                accessCode: accessCode,
                formUrl: formUrl
            };
        } else {
            let errorMessage = "";
            errors.forEach(function(error) {
                const eMessage = rapid.getMessage(error, "en");
                errorMessage += eMessage;
            });
            throw new Error(errorMessage);
        }
    } catch(err) {
        console.error("preAuthorizeTransaction Error", err);
        return false;
    }
}

cartItemSchema.statics.capturePayment = async function(transactionId, totalAmount) {
    try {
        const client = rapid.createClient(config.PAY_API_KEY, config.PAY_API_PASS, config.PAY_API_ENDPOINT);
        const transactionRes = await client.createTransaction(rapid.Enum.Method.AUTHORISATION, {
            "Payment": {
                "TotalAmount": totalAmount,
            },
            "TransactionId": transactionId
        });

        if (transactionRes.get('TransactionStatus')) {
            const captureTransactionId = transactionRes.get('TransactionID');
            return captureTransactionId;
        } else {
            const errorMessage = "";
            if(transactionRes.get('ResponseMessage')) {
                const errorCodes = transactionRes.get('ResponseMessage').split(', ');
                errorCodes.forEach(function(errorCode) {
                    errorMessage += `${rapid.getMessage(errorCode, "en")}, `;
                });
            }
            throw new Error(errorMessage);
        }
    } catch(err) {
        console.error("capturePayment Error", err);
        return false;
    }
}

cartItemSchema.statics.cancelTransaction = async function(transactionId) {
    try {
        const client = rapid.createClient(config.PAY_API_KEY, config.PAY_API_PASS, config.PAY_API_ENDPOINT);
        const transactionRes = await client.cancelTransaction(transactionId);

    
        if (transactionRes.get('TransactionStatus')) {
            const cancelTransactionId = transactionRes.get('TransactionID');
            return cancelTransactionId;
        } else {
            const errorMessage = "";
            if(transactionRes.get('ResponseMessage')) {
                const errorCodes = transactionRes.get('ResponseMessage').split(', ');
                errorCodes.forEach(function(errorCode) {
                    errorMessage += `${rapid.getMessage(errorCode, "en")}, `;
                });
            }
            throw new Error(errorMessage);
        }
    } catch(err) {
        console.error("cancelTransaction Error", err);
        return false;
    }
}

cartItemSchema.statics.calculateCharges = function(rental, commission, discount, deliveryDate) {
    
    let rentalCharges = 0,
        dlrCharges = 0,
        t2yCommission = 0,
        discountCharges = 0,
        lateFees = 0,
        totalCharges = 0;
    const isRental = (rental.transactionType === "rent") ? true : false;

    if (isRental) {
        // Rental Charges Calculation - Start ----------------------------------------

        let rentalChargesApplicable = rental.isPickUp ? rental.rentalCharges.pickUp : rental.rentalCharges.door2Door;
        rentalChargesApplicable = rentalChargesApplicable.sort(compareValues('duration', 'asc'));
        const oneDayChargeApplicableAfterSchedule = rentalChargesApplicable.shift();

        const rentalPeriodStart = new Date(rental.rentalPeriod.start).getTime();
        const rentalPeriodEnd = new Date(rental.rentalPeriod.end).getTime();
        const rentalPeriod = rentalPeriodEnd - rentalPeriodStart;

        // Calculate Extension Period ------------------------------------------------
        let extensionPeriod = 0;
        let extensionPeriods = rental.extension ? rental.extension.map((extensionPeriod) => {
            return {
                extendTill: (new Date(extensionPeriod.extendTill).getTime())
            };
        }) : [];
        extensionPeriods = extensionPeriods.sort(compareValues('extendTill', 'desc'));
        extensionPeriod = extensionPeriods ? extensionPeriods[0] : 0;
        extensionPeriod = extensionPeriod ? extensionPeriod.extendTill : 0;

        const totalRentalPeriod = rentalPeriod + extensionPeriod;

        rentalCharges = getRentalChargesForPeriod(totalRentalPeriod, rentalChargesApplicable, oneDayChargeApplicableAfterSchedule);

        if (deliveryDate) {
            const rentalDelivery = deliveryDate.getTime();
            const deliveryPeriod = rentalDelivery - rentalPeriodStart;


            if (deliveryPeriod > totalRentalPeriod) {
                const deliveryCharges = getRentalChargesForPeriod(deliveryPeriod, rentalChargesApplicable, oneDayChargeApplicableAfterSchedule);

                lateFees = (deliveryCharges - rentalCharges) * constants.lateFeesPercentage;
            }
        }

        // Rental Charges Calculation - End ----------------------------------------
    } else {
        // Rental Charges Calculation - Start ----------------------------------------

        rentalCharges = parseInt(rental.units) * rental.salesCharges.price;
        // Rental Charges Calculation - End ----------------------------------------
    }

    dlrCharges = rental.doChargeDLR ? (rentalCharges * constants.dlrChargesPercentage) : 0;

    if (discount) {
        const chargeType = discount._doc.chargeType;
        const charge = discount._doc.charge;

        if (chargeType === "flat") {
            discountCharges = charge;
        } else if (chargeType === "percentage") {
            discountCharges = (rentalCharges * (charge / 100));
        }
    }

    totalCharges = rentalCharges + dlrCharges + lateFees - discountCharges;

    if (commission) {
        const chargeType = commission._doc.chargeType;
        const charge = commission._doc.charge;

        if (chargeType === "flat") {
            t2yCommission = charge;
        } else if (chargeType === "percentage") {
            t2yCommission = (totalCharges * (charge / 100));
        }
    }

    totalCharges += t2yCommission;

    const totalChargesObj = {
        total: totalCharges,
        rentalCharges: rentalCharges,
        dlrCharges: dlrCharges,
        t2yCommission: t2yCommission,
        discount: discountCharges,
        lateFees: lateFees
    };

    return totalChargesObj;
}

cartItemSchema.statics.calculateCancellationCharges = function(period, rental) {
    let cancellationCharge = 0;
    let prevRentalDuration = 0;
    const cancellationChargeForPeriod = constants.cancellationChargesRates.find((cancellationCharge) => {
        if (prevRentalDuration < period && period <= cancellationCharge.duration) {
            return true;
        }
        prevRentalDuration = cancellationCharge.duration;
        return false;
    });

    if (cancellationChargeForPeriod) {
        if (cancellationChargeForPeriod.chargeType === "flat") {
            cancellationCharge = cancellationChargeForPeriod.charge;
        } else if (cancellationChargeForPeriod.chargeType === "percentage") {
            cancellationCharge = cancellationChargeForPeriod.charge * rental.totalCharges.total;
        }
    }

    const totalChargesObj = {
        ...rental.totalCharges,
        cancellationCharges: cancellationCharge
    };

    return totalChargesObj;
}

function getRentalChargesForPeriod(period, rentalChargesApplicable, oneDayChargeApplicableAfterSchedule) {
    let prevRentalDuration = 0;
    const rentalChargeForPeriod = rentalChargesApplicable.find((rentalCharge) => {
        if (prevRentalDuration < period && period <= rentalCharge.duration) {
            return true;
        }
        prevRentalDuration = rentalCharge.duration;
        return false;
    });
    if (rentalChargeForPeriod) {
        return rentalChargeForPeriod.charges;
    } else {
        const maxDurationChargesApplicable = rentalChargesApplicable[(rentalChargesApplicable.length - 1)];
        const extraPeriod = period - maxDurationChargesApplicable.duration;
        const extraPeriodDays = Math.ceil(extraPeriod / constants.ms.day);

        return (maxDurationChargesApplicable.charges + (extraPeriodDays * oneDayChargeApplicableAfterSchedule.charges));
    }
}

module.exports = mongoose.model('cartItem', cartItemSchema);