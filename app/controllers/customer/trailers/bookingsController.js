const stripe = require("stripe")(process.env.STRIPE_SECRET);
const axios = require("axios");
const AWS = require("aws-sdk");
const moment = require('moment');

const SQS = new AWS.SQS({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: "ap-south-1",
});

const Booking = require("../../../models/booking");
const Trailers = require("../../../models/trailers");
const User = require("./../../../models/users");
const BookingReq = require("./../../../models/bookingReq");
const LicenseePayout = require("../../../models/licenseePayouts");
const Employee = require("../../../models/employees");
const Invoice = require("../../../models/invoices");
const UpsellItem = require("../../../models/upsellItems");
const Financials = require("../../../models/financials");

const extendBooking = require("../../../helpers/extendBooking");
const reschedule = require("../../../helpers/reschedule");
const cancelBooking = require("../../../helpers/cancelBooking");
const calculateCharges = require("../../../helpers/calculateCharges");
const createInvoice = require("../../../helpers/createInvoice");
const {
  licenseeNotification,
  customerNotification,
} = require("../../../helpers/fcmAdmin");

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} = require("./../../../helpers/errors");

// upsellItems: [{id: 'UpsellId', quantity: Number}]
async function getBookingCharges(req, res) {
  const {
    trailerId,
    upsellItems = [],
    startDate,
    endDate,
    isPickup,
  } = req.body;

  const trailer = await Trailers.findById(trailerId);
  if (!trailer) throw new NotFoundError(`Trailer not found`);

  const upsellItemsList = [];

  if (upsellItems) {
    for (let item of upsellItems) {
      const upsellItem = await UpsellItem.findById(item.id);
      if (!upsellItem) throw new NotFoundError(`Upsell Item not found`);
      upsellItemsList.push({
        id: item.id,
        quantity: item.quantity,
        item: upsellItem,
      });
    }
  }

  const delivery = isPickup ? "pickup" : "door2door";
  const charges = await calculateCharges(
    trailer,
    upsellItemsList,
    delivery,
    new Date(startDate),
    new Date(endDate)
  );
  // const { totalCharges } = await calculateRentalItemCharges('trailer', trailer, isPickup ? 'pickup' : 'door2door', new Date(startDate), new Date(endDate));

  charges.upsellCharges = Object.values(charges.upsellCharges);
  return res.json(charges);
}

async function editBooking(req, res) {
  let newId;
  let stripeClientSecret, booking;
  let bookingReq;
  let {
    rentalId,
    bookingId,
    newStartDate,
    newEndDate,
    type, //extend, reschedule, cancel
  } = req.body;

  //TODO: Remove this shit.....
  bookingReq = new BookingReq({
    body: JSON.stringify(req.body),
    headers: JSON.stringify(req.headers),
  });
  bookingReq.save();

  const oldBooking = await Booking.findById(bookingId);
  if (!oldBooking) throw new NotFoundError("Booking not found");
  let actionRequired = "none";

  const trailer = await Trailers.findById(oldBooking.trailerId);
  if (!trailer) throw new NotFoundError("Trailer not found");

  const deliveryType = oldBooking.isPickup ? "pickup" : "door2door";
  const upsellItems = oldBooking.upsellItems;

  const upsellItemsList = [];
  for (let item of upsellItems) {
    const upsellItem = await UpsellItem.findById(item.id);
    if (!upsellItem) throw new NotFoundError(`Upsell Item not found`);
    upsellItemsList.push({
      id: item.id,
      quantity: item.quantity,
      item: upsellItem,
    });
  }

  if (type === "cancel") {
    actionRequired = "refund";
    //TODO check how to mark cancelled

    await Booking.findByIdAndUpdate(oldBooking._id, {
      hasCompletetedPayment: true,
      refundRequired: "true",
    });
    await cancelBooking(bookingReq._id);
    return res.status(200).json({
      success: true,
      message: `Refund will be initited by admin shortly`,
    });
  } else if (type === "reschedule") {
    const charges = await calculateCharges(
      trailer,
      upsellItemsList,
      deliveryType,
      newStartDate = moment(new Date(newStartDate)),
      newEndDate = moment(new Date(newEndDate)),
      oldBooking.doChargeDLR
    );
    charges.upsellCharges = Object.values(charges.upsellCharges);
    const alreadyBookedSearchCondition = {
      $and : [
        {'bookedByUserId' : {$ne : oldBooking.bookedByUserId}},
        {rentedItems : { $elemMatch : { itemType : "trailer" , itemId : oldBooking.trailerId }}},
        {"rentalPeriod.start": { $lte: newEndDate.toISOString() }},
        {"rentalPeriod.end": { $gte: newStartDate.toISOString() }}
      ]
    }
    const alreadyBooked  = await Invoice.find(alreadyBookedSearchCondition).lean()
    if(alreadyBooked.length > 0){
      return res.send({
        success : false,
        message : 'Trailer already Booked for these Dates'
      })
    }
    // TODO add logic for date availability here
    // TODO tax applied in full while rescheduling?
    let newBooking = new Booking({
      trailerId: oldBooking.trailerId,
      upsellItems: oldBooking.upsellItems,
      startDate: new Date(newStartDate),
      endDate: new Date(newEndDate),
      customerId: oldBooking.customerId,
      isPickup: oldBooking.isPickup,
      customerLocation: oldBooking.customerLocation, //parse into the location schema (automatically done by mongoose I think)
      licenseeId: trailer.licenseeId,
      charges,
      doChargeDLR: oldBooking.doChargeDLR,
      prevRevision: oldBooking._id,
      bookingType: "reschedule",
    });

    booking = await newBooking.save();
    newId = booking._id;
    await Booking.findByIdAndUpdate(oldBooking._id, { isActive: false });
    // TODO replace newCharges with rental+upsell+tax (refer booking contoller vitual function)
    // Alternatively can save a new booking and use that?
    if (
      booking.charges.totalPayableAmount ===
      oldBooking.charges.totalPayableAmount
    ) {
      // booing does not require update as it is created fresh
      // await Booking.findByIdAndUpdate(booking.id, {startDate, endDate});
      await Booking.findByIdAndUpdate(booking.id, {
        stripePaymentIntentId: oldBooking.stripePaymentIntentId,
      });
      await reschedule(rentalId, newStartDate, newEndDate, charges, newId);

      const licenseeId = await Invoice.findById(
        { _id: rentalId },
        { licenseeId: 1 }
      );
      const fcmToken = await Employee.findOne(
        { licenseeId:licenseeId.licenseeId, isOwner: true },
        { fcmDeviceToken: 1 }
      );

      await licenseeNotification(
        "Reschedule Request",
        "Reschedule Request for a Booking",
        "Reschedule",
        rentalId,
        fcmToken.fcmDeviceToken
      );
      // await Invoice.findByIdAndUpdate(rentalId, { bookingId: newId });
    } else {
      actionRequired = "payment";
      // TODO Fill shipping information from account details
      const oldPaymentIntent = await stripe.paymentIntents.retrieve(
        oldBooking.stripePaymentIntentId
      );

      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(charges.totalPayableAmount * 100),
        currency: "aud",
        description: "T2Y Booking service",
        shipping: {
          name: "Someone",
          address: {
            line1: "510 Townsend St",
            postal_code: "2020",
            city: "Sydney",
            state: "Sydney",
            country: "AU",
          },
        },
        metadata: {
          reqId: bookingReq._id.toString(),
          type: "reschedule",
          newBookingId: newId.toString(),
          rentalId: rentalId.toString(),
          refundAmount: oldPaymentIntent.amount,
          refundStripeId: oldBooking.stripePaymentIntentId,
        },
      });
      stripeClientSecret = paymentIntent.client_secret;
      await Booking.findByIdAndUpdate(booking.id, {
        stripePaymentIntentId: paymentIntent.id,
      });
    }
  } else if (type === "extend") {
    const charges = await calculateCharges(
      trailer,
      upsellItemsList,
      deliveryType,
      newStartDate = moment(new Date(newStartDate)),
      newEndDate = moment(new Date(newEndDate)),
      oldBooking.doChargeDLR
    );
    charges.upsellCharges = Object.values(charges.upsellCharges);

    const alreadyBookedSearchCondition = { rentedItems : { $elemMatch : { itemType : "trailer" , itemId : oldBooking.trailerId }},
  
          "rentalPeriod.start": { $lte: newEndDate.toISOString() },

          "rentalPeriod.end": { $gte: newStartDate.toISOString() }

  }

    const alreadyBooked  = await Invoice.find(alreadyBookedSearchCondition).lean()
    if(alreadyBooked.length > 0){
      return res.send({
        success : false,
        message : 'Trailer already Booked for these Dates'
      })
    }

    let newBooking = new Booking({
      trailerId: oldBooking.trailerId,
      upsellItems: oldBooking.upsellItems,
      startDate: new Date(newStartDate),
      endDate: new Date(newEndDate),
      customerId: oldBooking.customerId,
      isPickup: oldBooking.isPickup,
      customerLocation: oldBooking.customerLocation, //parse into the location schema (automatically done by mongoose I think)
      licenseeId: trailer.licenseeId,
      charges,
      // Charges calculated using that calculateRentalItemCharges helper function
      // trailerCharges: newCharges.rentalCharges,
      // upsellCharges: 0, // TODO pls update, fix, this hurts :'(
      // cancellationCharges: newCharges.cancellationCharges,
      // dlrCharges: newCharges.dlrCharges,
      // taxes: newCharges.taxes,
      doChargeDLR: oldBooking.doChargeDLR,
      prevRevision: oldBooking._id,
      bookingType: "extend",
    });

    booking = await newBooking.save();
    newId = booking._id;
    // TODO replace newCharges with rental+upsell+tax (refer booking contoller vitual function)
    // Alternatively can save a new booking and use that?
    if (
      booking.charges.totalPayableAmount > oldBooking.charges.totalPayableAmount
    ) {
      // TODO Create new payment
      actionRequired = "payment";
      //CHECK : I thought we need to charge full amount again. Could create issues when we try to cancel the extension
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(
          (booking.charges.totalPayableAmount -
            oldBooking.charges.totalPayableAmount) *
            100
        ),
        currency: "aud",
        description: "T2Y Booking service",
        shipping: {
          name: "Someone",
          address: {
            line1: "510 Townsend St",
            postal_code: "2020",
            city: "Sydney",
            state: "Sydney",
            country: "AU",
          },
        },
        metadata: {
          reqId: bookingReq._id.toString(),
          type: "extend",
          newBookingId: newId.toString(),
          rentalId: rentalId.toString(),
        },
      });
      stripeClientSecret = paymentIntent.client_secret;
      await Booking.findByIdAndUpdate(booking.id, {
        stripePaymentIntentId: paymentIntent.id,
      });
    } else if (
      booking.charges.totalPayableAmount ===
      oldBooking.charges.totalPayableAmount
    ) {
      //TODO change dates on bookng -> not needed, new booking alreadt made
      await Booking.findByIdAndUpdate(booking.id, {
        hasCompletetedPayment: true,
        isActive: false,
      });
      await extendBooking(rentalId, newEndDate, charges, newId);
      // await Invoice.findByIdAndUpdate(rentalId, { bookingId: newId });
    } else if (
      booking.charges.totalPayableAmount < oldBooking.charges.totalPayableAmount
    ) {
      actionRequired = "refund";
      //TODO call refund
      // CHECK: Why difference?? I think we'll still need to refund full amount and charge new amount. Could create issues when we try to cancel the extension
      const refundAmount = parseInt(
        (oldBooking.charges.totalPayableAmount -
          booking.charges.totalPayableAmount) *
          100
      );
      const refund = await stripe.refunds.create({
        amount: refundAmount,
        payment_intent: oldBooking.stripePaymentIntentId,
        metadata: {
          reqId: bookingReq._id.toString(),
          type: "extend",
          newBookingId: newId.toString(),
          rentalId: rentalId.toString(),
        },
      });

      if (refund.status === "succeeded") {
        await Booking.findByIdAndUpdate(booking.id, {
          $set: { hasCompletetedPayment: true, isActive: false },
        });
        await extendBooking(rentalId, newEndDate, charges, newId);
        await Invoice.findByIdAndUpdate(rentalId, { bookingId: newId });
        //   await Financials.findOneAndUpdate({rentalId}, {
        //     $push: {
        //       outgoing: {
        //         revisionType: 'extension',
        //         amount: refundAmount,
        //         revisedAt: new Date()
        //       }
        //     },
        //     $set: {
        //       bookingId: newId
        //     }
        // })
      } else {
        throw new Error("Could nextendot refund. Please try extending again");
      }

      // TODO update dates
    }
  }

  if (actionRequired === "refund") {
    return res.status(200).json({
      success: true,
      message: `Refund Processing`,
      actionRequired,
      newBookingId: newId,
      booking,
      priceDiff:
        booking.charges.totalPayableAmount -
        oldBooking.charges.totalPayableAmount,
    });
  } else if (actionRequired === "payment") {
    return res.status(200).json({
      success: true,
      message: `Payment required`,
      actionRequired,
      newBookingId: newId,
      stripeClientSecret,
      booking,
      priceDiff:
        booking.charges.totalPayableAmount -
        oldBooking.charges.totalPayableAmount,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: `No action required`,
      actionRequired,
      newBookingId: newId,
    });
  }
}

//TODO: CHECK EXISTING VALIDATION FROM POST: /invoices route
async function createNewBooking(req, res, next) {
  let {
    trailerId,
    upsellItems = [],
    startDate,
    endDate,
    isPickup,
    customerLocation,
    doChargeDLR, //parse into the location schema (automatically done by mongoose I think)
  } = req.body;

  startDate = moment(new Date(startDate));
  endDate = moment(new Date(endDate));
  console.log('Start Date '+startDate)
  console.log('End Date ' +endDate )
  const alreadyBookedSearchCondition = {rentedItems : { $elemMatch : { itemType : "trailer" , itemId : trailerId }},
  
          "rentalPeriod.start": { $lte: endDate.toISOString() },

          "rentalPeriod.end": { $gte: startDate.toISOString() }

  }
  const alreadyBooked  = await Invoice.find(alreadyBookedSearchCondition)
  console.log(alreadyBookedSearchCondition)
  console.log(alreadyBooked)
  if(alreadyBooked.length > 0){
    return res.send({
      success : false,
      message : 'Trailer already Booked for these Dates'
    })
  }

  const trailer = await Trailers.findById(trailerId).lean();

  if (!trailer) throw new NotFoundError("Trailer not found");

  const customerId = req.userId;

  const customer = await User.findById(customerId, {
    isEmailVerified: 1,
    isMobileVerified: 1,
    driverLicense: 1,
  });
  if (!customer) throw new NotFoundError("Customer not found");
  if (!customer.isEmailVerified)
    throw new UnauthorizedError("Email not verified");
  if (!customer.isMobileVerified)
    throw new UnauthorizedError("Mobile number not verified");
  if (!customer.driverLicense.accepted)
    throw new UnauthorizedError("Driver licensee not verified");

  const upsellItemsList = [];
  for (let item of upsellItems) {
    if (!item.id || !item.quantity)
      throw new NotFoundError("Upsell id and quantity required");
    const upsellItem = await UpsellItem.findById(item.id);
    if (!upsellItem)
      throw new NotFoundError(`Unable to find upsell item with id ${item.id}`);
    upsellItemsList.push({
      id: item.id,
      item: upsellItem,
      quantity: item.quantity,
    });
  }

  const delivery = isPickup ? "pickup" : "door2door";
  const charges = await calculateCharges(
    trailer,
    upsellItemsList,
    delivery,
    startDate,
    endDate,
    doChargeDLR
  );

  charges.upsellCharges = Object.values(charges.upsellCharges);

  /* We're multiplying by 100 because the amount is to be expressed in the smallest unit of the currency (which would be cents or whatever it is for AUD). So to pay AUD 2, you'd have to enter 200 as the amount.
   * And the stripe API has to take an integer here, hence the parseInt
   * Docs: https://stripe.com/docs/api/payment_intents/create
   **/
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(charges.totalPayableAmount * 100),
    currency: "aud",
    description: "T2Y Booking service",
    shipping: {
      name: "Someone",
      address: {
        line1: "510 Townsend St",
        postal_code: "2020",
        city: "Sydney",
        state: "Sydney",
        country: "AU",
      },
    },
    metadata: { type: "booking", instance: process.env.HOST },
  });

  let newBooking = new Booking({
    trailerId,
    upsellItems,
    startDate,
    endDate,
    customerId,
    isPickup,
    customerLocation, //parse into the location schema (automatically done by mongoose I think)
    licenseeId: trailer.licenseeId,
    charges,
    // Charges calculated using that calculateRentalItemCharges helper function
    // trailerCharges: totalCharges.rentalCharges,
    // upsellCharges: 0, // TODO pls update, fix, this hurts :'(
    // cancellationCharges: totalCharges.cancellationCharges,
    // dlrCharges: totalCharges.dlrCharges || 0,
    // taxes: totalCharges.taxes,
    doChargeDLR: doChargeDLR,
    stripePaymentIntentId: paymentIntent.id,
  });

  // newBooking.stripePaymentIntentId = paymentIntent.id;

  const booking = await newBooking.save();

  return res.status(200).json({
    booking,
    stripeClientSecret: paymentIntent.client_secret,
  });
}

// this route will update the hasPaid boolean in the booking and will generate a request for the licensee to approve
// TODO replace the (req, res, next) signature with a (req, res) signature, or follow the pattern from the other routes where you call next(err)
async function markPaymentComplete(req, res) {
  try {
    const stripeEndpointSecret =
      process.env.STRIPE_PAYMENT_COMPLETE_ENDPOINT_SECRET;

    const sig = req.headers["stripe-signature"];

    let event = null;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        stripeEndpointSecret
      );
    } catch (err) {
      // invalid signature
      return res.status(400).json({
        success: false,
        message: "Invalid stripe signature",
      });
    }

    const intent = event.data.object;

    if (event.data.object.metadata.instance !== process.env.HOST) {
      return res.status(200).send();
    }

    if (event["type"] === "payment_intent.payment_failed") {
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      // TODO change model to enum. If failed, chance status to failed so that user
      // knows. Else succeded or pending.
      // So I'm not sure what can be done in case payment fails
      // the same payment intent is valid, so there is no point in setting the hasCompletetedPayment property to false or deleting the booking or something
      // Perhaps we'll have to add some mecahnism to notify the customer that the payment failed, and the customer can try again (this was suggested in the stripe webhook docs
      // https://stripe.com/docs/payments/payment-intents/verifying-status#webhooks

      // This will be a status 200 because though the webhook informs us of failure, the HTTP request issued by the webhook still succeeds
      return res.status(200).json({
        success: false,
        message: `Payment with ID ${intent.id} failed with message ${message}`,
      });
    } else if (event["type"] === "payment_intent.succeeded") {
      // Quickly send the 200 status code as recommended by stripe docs
      res.status(200).json({
        success: true,
        message: `Payment with ID ${intent.id} successful`,
      });
      // If the payment is successful, we can update the booking and create the invoice
      // TODO move this entire block of code into a helper function while refactoring. This is ugly.

      let booking = await Booking.findOne({
        stripePaymentIntentId: intent.id,
      }).exec();

      // Now that the payment is done and the invoice is ready, we update the booking thingy
      // booking.hasCompletetedPayment = true;
      // booking.save();

      if (event.data.object.metadata.type === "extend") {
        const newId = event.data.object.metadata.newBookingId;
        const rentalId = event.data.object.metadata.rentalId;
        const existingBooking = await Booking.findByIdAndUpdate(
          newId,
          { hasCompletetedPayment: true },
          { new: true }
        );
        await extendBooking(
          rentalId,
          existingBooking.endDate,
          existingBooking.charges,
          newId
        );
        await pushToInvoiceQueue(rentalId);
        const licenseeId = await Invoice.findById(
          { _id: rentalId },
          { licenseeId: 1 }
        );
        const fcmToken = await Employee.findOne(
          { licenseeId, isOwner: true },
          { fcmDeviceToken: 1 }
        );
        await licenseeNotification(
          "Extention Request",
          "Extention Request for a Booking",
          "Extend",
          rentalId,
          fcmToken.fcmDeviceToken
        );
      } else if (event.data.object.metadata.type === "reschedule") {
        const newId = event.data.object.metadata.newBookingId;
        const rentalId = event.data.object.metadata.rentalId;
        const existingBooking = await Booking.findByIdAndUpdate(
          newId,
          { hasCompletetedPayment: true },
          { new: true }
        ).lean();
        await reschedule(
          rentalId,
          existingBooking.startDate,
          existingBooking.endDate,
          existingBooking.charges,
          newId
        );
        const licenseeId = await Invoice.findById(
          { _id: rentalId },
          { licenseeId: 1 }
        );
        const fcmToken = await Employee.findById(
          { licenseeId: licenseeId.licenseeId },
          { fcmDeviceToken: 1 }
        );
        const refundAmount = event.data.object.metadata.refundAmount;
        const refundStripeId = event.data.object.metadata.refundStripeId;

        await stripe.refunds.create({
          amount: refundAmount,
          payment_intent: refundStripeId,
          metadata: {
            // reqId: bookingReq._id.toString(),
            type: "reschedule",
            newBookingId: newId.toString(),
            rentalId: rentalId.toString(),
          },
        });
        await pushToInvoiceQueue(rentalId);
        await licenseeNotification(
          "Reschedule Request",
          "Reschedule Request for a Booking",
          "Reschedule",
          rentalId,
          fcmToken.fcmDeviceToken
        );
      } else {
        const {
          upsellItems,
          licenseeId,
          trailerId,
          startDate,
          endDate,
          isPickup,
          customerLocation,
          customerId,
        } = booking.toObject();

        let upsellItemDetails = [];
        if (upsellItems) {
          upsellItemDetails = upsellItems.map((item) => ({
            itemType: "upsellitem",
            id: item.id,
            quantity: item.quantity,
          }));
        }

        const invoiceData = {
          objRental: {
            description: "",
            licenseeId,
            trailerId: trailerId,
            upsellItems: upsellItemDetails,
            rentalPeriod: {
              start: startDate,
              end: endDate,
            },
            doChargeDLR: booking.doChargeDLR, // TODO confirm whether this is sensible, or if something else needs to be done
            isPickup,
            bookingId: booking._id,
            pickUpLocation: customerLocation, // TODO confirm whether this is accurate
            dropoffLocation: customerLocation, // TODO confirm whether this is accurate
          },
          userId: customerId,
        };

        console.log("invoice data", JSON.stringify(invoiceData));

        let invoice = await createInvoice(invoiceData);
        console.log(`Created invoiceId ${invoice._id}`);
        await pushToInvoiceQueue(invoice._id);
        let financial = new Financials({
          customerId: customerId,
          licenseeId: licenseeId,
          bookingId: booking._id,
          rentalId: invoice._id,
          incoming: [
            {
              revisionType: "booking",
              amount: invoice.charges.totalPayableAmount,
              revisedAt: new Date(),
            },
          ],
          outgoing: [],
        });
        const employeeData = await Employee.findOne({licenseeId:licenseeId,isOwner:true},{fcmDeviceToken:1})
        await licenseeNotification("Booking Complete",`Booking Made for Booking ID ${booking._id}`,'booking',`${invoice._id}`,employeeData.fcmDeviceToken)
        await financial.save();
        // All the stuff until here is a part of the invoice creation thingy and must be moved into a helper function
      }
    } else if (event["type"] === "payout.paid") {
      res.status(200).json({
        success: true,
        message: `Payment with ID ${intent.id} successful`,
      });

      let licenseePayout = await LicenseePayout.findOne({
        stripePayoutId: intent.id,
      }).exec();

      licenseePayout.completed = true;
      licenseePayout.save();
    } else if (event["type"] === "payout.failed") {
      //TODOdo something here, ideally set complteted to enum
    } else {
      // Nothing else to do here I suppose
      return res.status(200).json({
        success: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `${err}`,
    });
  }
}

function pushToInvoiceQueue(invoiceId) {
  return SQS.sendMessage({
    MessageBody: JSON.stringify({ invoiceId }),
    QueueUrl: process.env.INVOICE_QUEUE_URL,
  }).promise();
}

// TODO replace the (req, res, next) signature with a (req, res) signature, or follow the pattern from the other routes where you call next(err)
/* TODO EXTREMELY IMPORTANT
 * Add the right kind of authentication and authorization to this route (this will happen in the index.js file or whatever (i.e. wherever the actual route is defined)
 * Only a licensee with the right privileges should be able to approve a request
 **/
async function updateBookingApprovalDetails(req, res, next) {
  try {
    // we don't take the isApproved field from the request body because invoking this route implies that the request was approved, and one of the main functions of this route is to set the isApproved field to true
    const {
      bookingId,
      approvedBy, // This is the ID of the employee who approves the request
    } = req.body;

    let booking = await Booking.findById(bookingId);

    // TODO confirm this
    // This check shouldn't really be necessary
    // Either an empty booking will raise an error when you try to set it's attributes
    // Or the save method will raise an error as indicated in the new mongoose docs
    // https://mongoosejs.com/docs/documents.html#:~:text=Mongoose%20documents%20track%20changes.,it%20into%20MongoDB%20update%20operators.&text=The%20save()%20function%20is,get%20full%20validation%20and%20middleware.
    if (!booking) {
      res.status(400).json({
        success: false,
        message: `Booking with bookingId ${bookingId} does not exist`,
      });
    }

    if (!booking.hasCompletetedPayment) {
      return res.status(400).json({
        success: false,
        message: `Booking with booking ID ${booking._id} has pending payments`,
      });
    }

    booking.isApproved = true;
    booking.approvedBy = approvedBy;

    const updatedBooking = await booking.save();

    return res.status(200).json({
      success: true,
      booking: updatedBooking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `${err}`,
    });
  }
}

module.exports = {
  createNewBooking,
  markPaymentComplete,
  updateBookingApprovalDetails,
  getBookingCharges,
  editBooking,
};
