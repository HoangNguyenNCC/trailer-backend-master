const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");
const dotenv = require("dotenv");

dotenv.config();
const config = process.env;

const chargesSchema = require("./chargesSchema");
const compareValues = require("../helpers/compareValues");
const constants = require("../helpers/constants");

let invoiceSchema = new Schema({
  bookedByUserId: { type: Schema.Types.ObjectId, required: true },
  licenseeId: { type: Schema.Types.ObjectId, required: true },

  invoiceNumber: { type: Number, unique: true },
  invoiceReference: { type: String, trim: true, unique: true },

  description: { type: String, trim: true },

  rentalPeriod: {
    type: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
  },
  doChargeDLR: { type: Boolean, required: true },
  isPickUp: { type: Boolean, required: true }, // pickup OR door2door
 
  rentedItems: {
    type: [
      {
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
            taxes: { type: Number, default: 0 },
          },
        },
        // rentalCharges: {
        //     type: {
        //         pickUp: [{
        //             type: {
        //                 duration: { type: Number, required: true, min: 1 },
        //                 charges: { type: Number, required: true, min: 1 }
        //             }
        //         }],
        //         door2Door: [{
        //             type: {
        //                 duration: { type: Number, required: true, min: 1 },
        //                 charges: { type: Number, required: true, min: 1 }
        //             }
        //         }],
        //     }
        // }
      },
    ],
  },
  total: { type: Number, default: 0 },
  charges: {
    type: chargesSchema,
  },
  //-----------------------------------------------------------------------

  pickUpLocation: {
    type: {
      text: { type: String, required: true },
      pincode: { type: String, trim: true /* , required: true */ },
      location: {
        type: {
          type: { type: String, trim: true, default: "Point" },
          coordinates: { type: [Number], required: true },
        },
        /* ,
                required: true */
      },
    },
    required: true,
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
          coordinates: { type: [Number], required: true },
        },
        required: true,
      },
    },
    required: true,
  },
  isTrackingDropOff: { type: Boolean, default: false },
  dropOffEmployeeId: { type: Schema.Types.ObjectId },

  driverLicenseScan: {
    type: {
      contentType: {
        type: String,
        trim: true,
        required: [
          true,
          "Image of the Driving License is sent in an Invalid format",
        ],
      },
      data: {
        type: String,
        required: [
          true,
          "Image of the Driving License is sent in an Invalid format",
        ],
      },
    },
  },

  //-----------------------------------------------------------------------

  isApproved: { type: Number, default: 0 },

  revisions: {
    type: [
      {
        revisionType: {
          type: String,
          trim: true,
          enum: ["rental", "reschedule", "extension", "cancellation"],
          default: "rental",
        },

        start: { type: Date, required: true },
        end: { type: Date, required: true },

        requestOn: { type: Date, required: true },
        requestUpdatedOn: { type: Date, required: true },

        isApproved: { type: Number, default: 0 },
        approvedBy: {
          type: String,
          trim: true,
          default: "licensee",
          enum: ["licensee", "admin"],
        },
        approvedById: { type: Schema.Types.ObjectId },
        approvedOn: { type: Date },

        charges: {
          type: chargesSchema,
        },
        //-----------------------------------------------------------------------

        paymentIntentId: { type: String, trim: true },
        paymentIntentClientSecret: { type: String, trim: true },
        paymentDate: { type: Date },
        paidAmount: { type: Number, default: 0 },
      },
    ],
  },

  bookingId: {
    type: Schema.Types.ObjectId,
  },
  //-----------------------------------------------------------------------

  rentalStatus: {
    type: String,
    trim: true,
    default: "booked",
    lowercase: true,
    enum: [
      "booked",
      "approved",
      "dispatched",
      "return-started",
      "delivered",
      "returned",
    ],
  },
  dispatchDate: { type: Date },
  deliveryDate: { type: Date },
  returnStartedDate: { type: Date },
  returnDate: { type: Date },

  isRatingsGiven: {
    type: Boolean,
    default: false,
  },

  isUserRated: {
    type : Boolean,
    default: false
  },

  rating: Number,

  review: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

invoiceSchema.pre("updateOne", { document: true }, async function (
  query,
  next
) {
  let invoice = this;
  invoice = invoice._update;

  const now = new Date();
  invoice.updatedAt = now;
  next();
});

invoiceSchema.statics.calculateCharges = function (
  rental,
  startDate,
  endDate,
  commission,
  discount,
  deliveryDate = undefined
) {
  let rentalCharges = 0,
    dlrCharges = 0,
    t2yCommission = 0,
    discountCharges = 0,
    lateFees = 0,
    totalCharges = 0,
    taxes = 0;
  const isRental = true;
  // const isRental = (rental.transactionType === "rent") ? true : false;

  if (isRental) {
    // Rental Charges Calculation - Start ----------------------------------------

    let rentalChargesApplicable = rental.isPickUp
      ? rental.rentalCharges.pickUp
      : rental.rentalCharges.door2Door;
    rentalChargesApplicable = rentalChargesApplicable.sort(
      compareValues("duration", "asc")
    );
    const oneDayChargeApplicableAfterSchedule = rentalChargesApplicable.shift();

    const rentalPeriodStart = moment(startDate).valueOf();
    const rentalPeriodEnd = moment(endDate).valueOf();
    const rentalPeriod = rentalPeriodEnd - rentalPeriodStart;

    rentalCharges = getRentalChargesForPeriod(
      rentalPeriod,
      rentalChargesApplicable,
      oneDayChargeApplicableAfterSchedule
    );

    if (deliveryDate) {
      const rentalDelivery = deliveryDate.getTime();
      const deliveryPeriod = rentalDelivery - rentalPeriodStart;

      if (deliveryPeriod > totalRentalPeriod) {
        const deliveryCharges = getRentalChargesForPeriod(
          deliveryPeriod,
          rentalChargesApplicable,
          oneDayChargeApplicableAfterSchedule
        );

        lateFees =
          (deliveryCharges - rentalCharges) * constants.lateFeesPercentage;
      }
    }

    // Rental Charges Calculation - End ----------------------------------------
  } else {
    // Rental Charges Calculation - Start ----------------------------------------

    rentalCharges = parseInt(rental.units) * rental.salesCharges.price;
    // Rental Charges Calculation - End ----------------------------------------
  }

  dlrCharges = rental.doChargeDLR
    ? rentalCharges * constants.dlrChargesPercentage
    : 0;

  if (discount) {
    const chargeType = discount._doc.chargeType;
    const charge = discount._doc.charge;

    if (chargeType === "flat") {
      discountCharges = charge;
    } else if (chargeType === "percentage") {
      discountCharges = rentalCharges * (charge / 100);
    }
  }

  totalCharges = rentalCharges + dlrCharges + lateFees - discountCharges;

  if (commission) {
    const chargeType = commission._doc.chargeType;
    const charge = commission._doc.charge;

    if (chargeType === "flat") {
      t2yCommission = charge;
    } else if (chargeType === "percentage") {
      t2yCommission = totalCharges * (charge / 100);
    }
  }

  totalCharges += t2yCommission;

  taxes = totalCharges * constants.taxRates;

  totalCharges = totalCharges + taxes;

  const totalChargesObj = {
    total: Math.round((totalCharges + Number.EPSILON) * 100) / 100,
    rentalCharges: Math.round((rentalCharges + Number.EPSILON) * 100) / 100,
    dlrCharges: Math.round((dlrCharges + Number.EPSILON) * 100) / 100,
    t2yCommission: Math.round((t2yCommission + Number.EPSILON) * 100) / 100,
    discount: Math.round((discountCharges + Number.EPSILON) * 100) / 100,
    lateFees: Math.round((lateFees + Number.EPSILON) * 100) / 100,
    cancellationCharges: 0.0,
    taxes: Math.round((taxes + Number.EPSILON) * 100) / 100,
  };

  return totalChargesObj;
};

function getRentalChargesForPeriod(
  period,
  rentalChargesApplicable,
  oneDayChargeApplicableAfterSchedule
) {
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
    const maxDurationChargesApplicable =
      rentalChargesApplicable[rentalChargesApplicable.length - 1];
    const extraPeriod = period - maxDurationChargesApplicable.duration;
    const extraPeriodDays = Math.ceil(extraPeriod / constants.ms.day);

    return (
      maxDurationChargesApplicable.charges +
      extraPeriodDays * oneDayChargeApplicableAfterSchedule.charges
    );
  }
}

invoiceSchema.statics.calculateCancellationCharges = function (period, rental) {
  let cancellationCharge = 0;
  let prevRentalDuration = 0;
  const cancellationChargeForPeriod = constants.cancellationChargesRates.find(
    (cancellationCharge) => {
      if (
        prevRentalDuration < period &&
        period <= cancellationCharge.duration
      ) {
        return true;
      }
      prevRentalDuration = cancellationCharge.duration;
      return false;
    }
  );

  if (cancellationChargeForPeriod) {
    if (cancellationChargeForPeriod.chargeType === "flat") {
      cancellationCharge = cancellationChargeForPeriod.charge;
    } else if (cancellationChargeForPeriod.chargeType === "percentage") {
      cancellationCharge =
        cancellationChargeForPeriod.charge * rental.totalCharges.total;
    }
  }

  if (cancellationCharge && !isNaN(cancellationCharge)) {
    cancellationCharge =
      Math.round((cancellationCharge + Number.EPSILON) * 100) / 100;
  } else {
    cancellationCharge = 0.0;
  }

  const totalChargesObj = {
    ...rental.totalCharges,
    cancellationCharges: cancellationCharge,
  };

  return totalChargesObj;
};

invoiceSchema.statics.getAllFieldsExceptFile = function () {
  return {
    bookedByUserId: 1,
    licenseeId: 1,

    invoiceNumber: 1,
    invoiceReference: 1,

    description: 1,

    rentalPeriod: 1,
    doChargeDLR: 1,
    isPickUp: 1,

    rentedItems: 1,
    total: 1,
    totalCharges: 1,

    //-----------------------------------------------------------------------

    pickUpLocation: 1,
    isTrackingPickUp: 1,
    pickUpEmployeeId: 1,

    dropOffLocation: 1,
    isTrackingDropOff: 1,
    dropOffEmployeeId: 1,

    //-----------------------------------------------------------------------

    isApproved: 1,

    revisions: 1,

    //-----------------------------------------------------------------------

    rentalStatus: 1,
    dispatchDate: 1,
    deliveryDate: 1,
    returnStartedDate: 1,
    returnDate: 1,

    /* 
        driverLicenseScan: 1,
        */

    createdAt: 1,
    updatedAt: 1,
  };
};

invoiceSchema.statics.getAllUsefulFieldsExceptFile = function () {
  return {
    bookedByUserId: 1,
    licenseeId: 1,

    invoiceNumber: 1,
    invoiceReference: 1,

    description: 1,

    rentalPeriod: 1,
    doChargeDLR: 1,
    isPickUp: 1,

    rentedItems: 1,
    total: 1,
    totalCharges: 1,

    //-----------------------------------------------------------------------

    pickUpLocation: 1,
    isTrackingPickUp: 1,
    pickUpEmployeeId: 1,

    dropOffLocation: 1,
    isTrackingDropOff: 1,
    dropOffEmployeeId: 1,

    //-----------------------------------------------------------------------

    isApproved: 1,

    revisions: 1,

    //-----------------------------------------------------------------------

    rentalStatus: 1,
    dispatchDate: 1,
    deliveryDate: 1,
    returnStartedDate: 1,
    returnDate: 1,

    /* 
        driverLicenseScan: 1,
        */

    createdAt: 1,
    updatedAt: 1,
  };
};

invoiceSchema.statics.getAllFieldsWithExistsFile = function () {
  return {
    bookedByUserId: 1,
    licenseeId: 1,

    invoiceNumber: 1,
    invoiceReference: 1,

    description: 1,

    rentalPeriod: 1,
    doChargeDLR: 1,
    isPickUp: 1,

    rentedItems: 1,
    total: 1,
    totalCharges: 1,

    //-----------------------------------------------------------------------

    pickUpLocation: 1,
    isTrackingPickUp: 1,
    pickUpEmployeeId: 1,

    dropOffLocation: 1,
    isTrackingDropOff: 1,
    dropOffEmployeeId: 1,

    //-----------------------------------------------------------------------

    isApproved: 1,

    revisions: 1,

    //-----------------------------------------------------------------------

    rentalStatus: 1,
    dispatchDate: 1,
    deliveryDate: 1,
    returnStartedDate: 1,
    returnDate: 1,

    driverLicenseScan: {
      $cond: {
        if: { $ifNull: ["driverLicenseScan", false] },
        then: false,
        else: true,
      },
    },

    createdAt: 1,
    updatedAt: 1,
  };
};

invoiceSchema.statics.getAllFieldsSpecified = function (fieldsArray) {
  const fieldsObj = {};

  fieldsArray.forEach((fieldName) => {
    if (fieldName === "driverLicenseScan") {
      fieldsObj["driverLicenseScan"] = {
        $cond: {
          if: { $ifNull: ["$driverLicenseScan", false] },
          then: true,
          else: false,
        },
      };
    } else {
      fieldsObj[fieldName] = 1;
    }
  });

  return fieldsObj;
};

module.exports = mongoose.model("invoice", invoiceSchema);
