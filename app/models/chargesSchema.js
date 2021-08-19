const { Schema, model } = require("mongoose");

const chargeSchema = new Schema({
  total: {
    type: Number,
    required: true,
  },
  rentalCharges: Number,
  dlrCharges: Number,
  t2yCommission: Number,
  discount: Number,
  lateFees: Number,
  cancellationCharges: Number,
  taxes: Number,
});

const upsellChargeSchema = new Schema({
  charges: {
    type: chargeSchema,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  payable: {
    type: Number,
    required: true,
  },
});

const chargesSchema = new Schema({
  totalPayableAmount: {
    type: Number,
    required: true,
  },
  trailerCharges: {
    type: chargeSchema,
    required: true,
  },
  upsellCharges: [upsellChargeSchema],
});

module.exports = chargesSchema;