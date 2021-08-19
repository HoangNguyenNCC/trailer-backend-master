const stripe = require("stripe")(process.env.STRIPE_SECRET);

const LicenseePayout = require("../../../models/licenseePayouts");
const Licensee = require("../../../models/licensees");
const Employee = require("../../../models/employees");
const Financial = require("../../../models/financials");
const Booking = require("../../../models/booking");
const User = require("../../../models/users");
const Trailer = require("../../../models/trailers");
const Upsell = require("../../../models/upsellItems");

const asyncForEach = require("../../../helpers/asyncForEach");
const mongoose = require("mongoose");
const { licenseeNotification } = require("../../../helpers/fcmAdmin");
const { BadRequestError } = require("../../../helpers/errors");
const asyncHandler = require("../../../helpers/asyncHandler");


async function getPendingLicenseePayments(req, res) {}

async function getPendingCustomerRefunds(req, res) {
  let searchCondition = { refundRequired: "true", isActive: true };
  if (req.query.customerEmail) {
    let user = await User.findOne(
      { email: req.query.customerEmail },
      { _id: 1 }
    );
    if (!user) {
      throw new BadRequestError("No User Registered with this Email");
    }
    searchCondition["customerId"] = mongoose.Types.ObjectId(user._id);
  }
  if (req.query.licenseeEmail) {
    let licensee = await Licensee.findOne(
      { email: req.query.licenseeEmail },
      { _id: 1 }
    );
    if (!licensee) {
      throw new BadRequestError("No User Registered with this Email");
    }
    searchCondition["licenseeId"] = mongoose.Types.ObjectId(licensee._id);
  }
  let pendingRefunds = await Booking.find(searchCondition);

  await asyncForEach(pendingRefunds, async (refund) => {
    refund = refund._doc;
    console.log({ id: refund._id });
    refund.licenseeDetails = await Licensee.findById(
      { _id: refund.licenseeId },
      { name: 1 }
    );
    refund.customerDetails = await User.findById(
      { _id: refund.customerId },
      { name: 1 }
    );
    refund.trailerDetails = await Trailer.findById(
      { _id: refund.trailerId },
      { name: 1 }
    );
    refund.rentalId = await Financial.findOne(
      { bookingId: refund._id },
      { rentalId: 1 }
    );
    console.log(refund.rentalId);
    upsellData = [];
    await asyncForEach(refund.upsellItems, async (upsell) => {
      const uinfo = await Upsell.findById({ _id: upsell.id }, { name: 1 });
      const upsellObject = {
        upsellInfo: uinfo,
        quantity: upsell.quantity,
      };
      upsellData.push(upsellObject);
    });
    refund.upsellDetails = upsellData;
    delete refund.licenseeId;
    delete refund.customerId;
    delete refund.trailerId;
    delete refund.upsellItems;
  });

  return res.status(200).json({
    success: true,
    pendingRefunds,
  });
}
async function refundCustomer(req, res) {
  const {
    customerId,
    bookingId,
    amount,
    sentBy, //ID of employee who sends money
    rentalId,
    remarks,
  } = req.body;

  let booking = await Booking.findById(bookingId, { stripePaymentIntentId: 1 });
  // 		console.log(stripeAccountId)
  const refund = await stripe.refunds.create({
    amount: amount,
    payment_intent: booking.stripePaymentIntentId,
    metadata: { type: "cancel" },
  });

  if (refund.status === "succeeded") {
    booking.refundRequired = "refunded";
    await Financial.findOneAndUpdate(
      { rentalId },
      {
        $push: {
          outgoing: {
            revisionType: "cancel",
            amount: amount,
            revisedAt: new Date(),
          },
        },
      }
    );
    await Booking.updateOne({ _id: bookingId }, { refundRequired: "refunded" });
    return res.status(200).json({
      success: true,
      message: `Refund Processing`,
      amount,
    });
  } else {
    throw new BadRequestError("Could not refund. Please try extending again");
  }
}

async function payoutLicensee(req, res) {
  console.log(req.body);
  const {
    licenseeId,
    amount,
    sentBy, //ID of employee who sends money
    rentalId,
    remarks,
  } = req.body;

  let stripeAccountId = await Licensee.findById(licenseeId, {
    stripeAccountId: 1,
    email: 1,
  });
  const fcmToken = await Employee.findOne(
    { email: stripeAccountId.email },
    { fcmDeviceToken: 1 }
  );
  console.log(stripeAccountId);
  const transfer = await stripe.transfers.create({
    amount: amount,
    currency: "AUD",
    destination: stripeAccountId.stripeAccountId,
  });

  // const transfer = await stripe.transfers.create({
  // 	amount: 1000,
  // 	currency: "inr",
  // 	destination: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
  //   });
  const licenseePayout = new LicenseePayout({
    stripePayoutId: transfer.id,
    licenseeId: licenseeId,
    amount: transfer.amount,
    destination: transfer.destination,
    rentalId,
    remarks,
    sentBy: sentBy,
    transfer,
  });

  const finalPayout = await licenseePayout.save();
  await Financial.findOneAndUpdate({ rentalId }, { isLicenseePaid: true });
  await licenseeNotification(
    "Payment Recieved",
    `Amount ${transfer.amount} transferred to ${transfer.destination} by ${sentBy}`,
    "Payments",
    rentalId,
    fcmToken.fcmDeviceToken
  );

  return res.status(200).json({
    success: true,
    booking: finalPayout,
  });
}

async function refundPaymentIntent(req, res) {
  const { stripePaymentIntentId, amount } = req.body;
  const refund = await stripe.refunds.create({
    amount: amount,
    payment_intent: stripePaymentIntentId,
  });
  //TODO save refund information, create new model?

  return res.status(200).json({
    success: true,
    booking: refund, //TODO decide on what needs to be sent back
  });
}

module.exports = {
  refundCustomer : asyncHandler(refundCustomer),
  payoutLicensee : asyncHandler(payoutLicensee),
  getPendingCustomerRefunds : asyncHandler(getPendingCustomerRefunds),
};
