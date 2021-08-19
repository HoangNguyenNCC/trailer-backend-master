const { Schema, model } = require('mongoose');
const validator = require('validator');
const chargesSchema = require('./chargesSchema');

const addressSchema = new Schema({
  text: {
    type: String, trim: true,
    required: [true, "Address Text is required"],
    validate: [{
        validator: (value) => {
            return !validator.isEmpty(value)
        },
        message: "Address Text should not be empty"
    }]
},
pincode: {
    type: String, trim: true
    /* ,
    required: [true, "Address Pincode is required"],
    validate: [{
        validator: (value) => {
            return !validator.isEmpty(value)
        },
        message: "Address Pincode should not be empty"
    }] */
},
coordinates: {
  type: [Number, Number],
  required: [true, "Address Location Coordinates is required"],
  validate: [{
      validator: (value) => {
          return (value.length === 2)
      },
      message: "Address Location Coordinates should have a length of 2"
  }]
}
})

const bookingSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  licenseeId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  trailerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  // list
  upsellItems: {
    type: [{
      id: Schema.Types.ObjectId,
      quantity: Number
    }]
  },

  // dates
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },

  isPickup: {
    type: Boolean,
    required: true,
    default: false, // TODO is this a sensible default?
  },

  charges: chargesSchema,
  
  // trailerCharges: {
  //   type: Number,
  //   default: 0,
  //   required: true,
  // },
  // upsellCharges: {
  //   type: Number,
  //   default: 0,
  //   required: true,
  // },
  // cancellationCharges: {
  //   type: Number,
  //   default: 0,
  //   required: true,
  // },

  dlrCharges: {
    type: Number,
    default: 0,
    required: true,
  },

  doChargeDLR: {
    type: Boolean,
    default: false
  },

  // // if stripe doesn't do taxes for us
  // taxes: {
  //   type: Number, 
  //   default: 0,
  //   required: true,
  // },

  // lateFeePerDay: {
  //   type: Number,
  //   default: 0,
  //   required: true,
  // },

  // locationSchema type
  customerLocation: {
    type: addressSchema,
  },
  // locationSchema type
  licenseeLocation: {
    type: addressSchema,
  },

  isApproved: {
    type: Boolean,
    required: true,
    default: false, 
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
  },
  isActive: {
    type:Boolean,
    required: true,
    default: true
  },
  bookingType: {
    type: String,
    enum:['book', 'reschedule', 'extend'],
    reqired:true,
    default:'book'
  },
  prevRevision:{
    type: Schema.Types.ObjectId,
    default:null
  },
  hasCompletetedPayment: {
    type: Boolean,
    required: true,
    default: false, 
  },

  stripePaymentIntentId: {
    type: String,
  },

  deliveredById: {
    type: Schema.Types.ObjectId,
  },  //Employee ID for delivery
  pickedUpById:{
    type: Schema.Types.ObjectId,
  },  //Employee ID for pickup
  refundRequired:{
    type: String, trim: true,
        default: "false",
        enum: {
            values: ["false", "true", "refunded"],
            message: "The value of type field should be 'Point'"
        }

}});

bookingSchema.virtual('totalCharges').get(function() {
  // TODO confirm whether the other kinds of charges are deducted beforehand or not
  // TODO should we also add DLR charges here? comission?
  const totalCharges = this.trailerCharges + this.upsellCharges + this.taxes + this.dlrCharges;
  return totalCharges;
});

const Booking = model('booking', bookingSchema);

module.exports = Booking;
