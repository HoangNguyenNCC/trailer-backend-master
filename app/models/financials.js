const { Schema, model, SchemaTypes } = require("mongoose");

const financialsSchema = new Schema({
  bookingId: {
    type: SchemaTypes.ObjectId,
    ref: "booking",
    required: true,
  },
  rentalId: {
    type: SchemaTypes.ObjectId,
    ref: "invoice",
    required: true,
  },
  customerId: {
    type: SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  licenseeId: {
    type: SchemaTypes.ObjectId,
    ref: "licensee",
    required: true,
  },
  // any payment coming in from the customer
  incoming: [
    {
      revisionType: {
        type: String,
        // enum: ["booking, reschedule", "extension", "cancellation"],
      },
      amount: {
        type: Number,
        required: true,
      },
      revisedAt: {
        type: Date,
        required: true,
      },
    },
  ],
  isLicenseePaid : {
    type : Boolean,
    default : false
  },
  // any outgoing payments to customer
  outgoing: [
    {
      revisionType: {
        type: String,
        // enum: ["booking, reschedule", "extension", "cancellation"],
      },
      amount: {
        type: Number,
        required: true,
      },
      revisedAt: {
        type: Date,
        required: true,
      },
    },
  ],
});

const Financials = model('financials', financialsSchema);

module.exports = Financials;