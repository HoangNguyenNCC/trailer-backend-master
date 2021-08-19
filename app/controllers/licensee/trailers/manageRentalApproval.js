const mongoose = require("mongoose");
const moment = require("moment");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();
const config = process.env;

const stripe = require("stripe")(config.STRIPE_SECRET);

const User = require("../../../models/users");
const Invoice = require("../../../models/invoices");
const Commission = require("../../../models/commissions");
const Discount = require("../../../models/discounts");
const Notification = require("../../../models/notifications");

const objectSize = require("../../../helpers/objectSize");
const aclSettings = require("../../../helpers/getAccessControlList");
const { logger } = require("../../../winston");
const { customerNotification } = require("../../../helpers/fcmAdmin");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ApiError,
} = require("./../../../helpers/errors");

/** 
 * 
 * @api {POST} /rental/approval Save Rental Request Approval data
 * @apiName LA - Save Rental Request Approval data
 * @apiGroup Licensee App - Trailer Rental
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} rentalId Rental Id
 * @apiParam {String} revisionId Id of Rental Revision
 * @apiParam {String} approvalStatus Approval Status of the Rental Request
 * @apiParam {Boolean} NOPAYMENT Add this parameter when you want to skip payment ( value = true )
 * 
 * 
 * @apiDescription API Endpoint to be used to save Rental Request Approval
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * 
   HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while approving/rejecting Rental Request",
        errorsList: []
    }
 
    HTTP/1.1 400 
    {
        success: false,
        message: "Error in Stripe Payments",
        error: "authentication_required",
        paymentMethod: err.raw.payment_method.id,
        clientSecret: err.raw.payment_intent.client_secret,
        amount: amountToCharge,
        card: {
            brand: err.raw.payment_method.card.brand,
            last4: err.raw.payment_method.card.last4
        }
    }

    HTTP/1.1 400
    {
        success: false,
        message: "Error in Stripe Payments",
        error: err.code,
        clientSecret: err.raw.payment_intent.client_secret
    }

    HTTP/1.1 400
    {
        success: false,
        message: "Error in Stripe Payments",
        error: err
    }

 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Success"
        // message: "Successfully approved/rejected Rental Extension Request"
        // message: "Successfully approved/rejected Rental Reschedule Request"
    }
 * 
 */
async function manageRentalApproval(req, res, next) {
  if (
    !req.requestFrom ||
    !req.requestFrom.licenseeId ||
    !req.requestFrom.employeeId ||
    !req.requestFrom.acl ||
    !aclSettings.validateACL(req.requestFrom.acl, "RENTALSTATUS", "UPDATE")
  ) {
    throw new ForbiddenError("Unauthorised Access");
  }

  let rentalRequestApproval = req.body;

  if (
    !rentalRequestApproval.rentalId ||
    (rentalRequestApproval.rentalId &&
      objectSize(rentalRequestApproval.rentalId) < 12)
  ) {
    throw new BadRequestError("VALIDATION-Invalid Rental ID");
  }

  if (
    !rentalRequestApproval.revisionId ||
    (rentalRequestApproval.revisionId &&
      objectSize(rentalRequestApproval.revisionId) < 12)
  ) {
    throw new BadRequestError("VALIDATION-Invalid Revision ID");
  }

  const approvalStatus =
    rentalRequestApproval.approvalStatus === "approved" ? 1 : 2;

  const approvalStatusStr = approvalStatus === 1 ? "approved" : "rejected";

  logger.info("approval status", { approvalStatusStr, approvalStatus });

  const invoiceId = mongoose.Types.ObjectId(rentalRequestApproval.rentalId);
  const revisionId = mongoose.Types.ObjectId(rentalRequestApproval.revisionId);
  const licenseeId =
    typeof req.requestFrom.licenseeId === "string"
      ? mongoose.Types.ObjectId(req.requestFrom.licenseeId)
      : req.requestFrom.licenseeId;

  // logger.info("invoice licesee", { invoiceId, licenseeId, revisionId });

  let savedRental = await Invoice.findOne(
    { _id: invoiceId, licenseeId: licenseeId },
    { revisions: 1, bookedByUserId: 1, description: 1, rentalPeriod: 1 }
  );

  if (!savedRental) {
    throw new NotFoundError("No trailer Found");
  }

  savedRental = savedRental._doc;

  // logger.info("invoice doc", savedRental);

  let isValidRevision = false;
  let isValidRevisionStatus = false;
  let revisionIndexToUpdate;
  let requestType;
  savedRental.revisions.forEach((revision) => {
    if (revision) {
      revision = revision._doc;

      if (
        revision._id.toString() === rentalRequestApproval.revisionId.toString()
      ) {
        isValidRevision = true;
        requestType = revision.revisionType;

        if (!revision.approvedOn) {
          isValidRevisionStatus = true;
        }
      }
    }
  });

  if (!isValidRevision) {
    throw new BadRequestError("VALIDATION-Invalid Revision Id");
  }

  if (!isValidRevisionStatus) {
    throw new BadRequestError(
      "VALIDATION-Can not change approval status of Approved/Rejected Request"
    );
  }

  let customerObj = await User.findOne(
    { _id: savedRental.bookedByUserId },
    { fcmDeviceToken: 1, stripeCustomerId: 1, name: 1, address: 1 }
  );
  customerObj = customerObj._doc;

  // --------------------------------------------------------------------------

  let updatedRevision,
    amountToCharge = 0;
  let rentalPaymentIntentId;
  savedRental.revisions.forEach((revision, revisionIndex) => {
    if (revision) {
      revision = revision._doc;

      // logger.info("revision before modification", revision);

      if (revision.revisionType === "rental") {
        rentalPaymentIntentId = revision.paymentIntentId;
      }

      if (revision._id.toString() === rentalRequestApproval.revisionId) {
        revision.isApproved = approvalStatus;
        revision.approvedOn = moment().toISOString();
        revision.approvedBy = "licensee";
        revision.approvedById = req.requestFrom.employeeId;

        updatedRevision = revision;

        if (
          revision.revisionType === "rental" ||
          revision.revisionType === "extension"
        ) {
          amountToCharge = revision.totalCharges
            ? revision.totalCharges.total
            : 0;
        }

        revisionIndexToUpdate = revisionIndex;
        // logger.info("revision after modification", revision);
        savedRental.revisions[revisionIndex] = revision;
      }
    }
  });

  // --------------------------------------------------------------------

  if (requestType === "reschedule") {
    amountToCharge = await calculateCharges(
      rentalRequestApproval.revisionId,
      requestType,
      savedRental
    );
  }

  let updateObject = {};
  if (approvalStatus === 1) {
    updateObject = {
      rentalPeriod: {
        start: updatedRevision.start,
        end: updatedRevision.end,
      },
      totalCharges: updatedRevision.totalCharges,
      revisions: savedRental.revisions,
      isApproved: approvalStatus,
    };
    if (requestType === "rental") {
      updateObject.rentalStatus = approvalStatusStr;
    }
    if (requestType === "extension") {
      updateObject.rentalPeriod.start = savedRental.rentalPeriod.start;
    }
    await customerNotification(
      ` Booking Status `,
      approvalStatus
        ? `Congratulations! Your Rental Request is successfully approved`
        : `Sorry, Your Rental Request for is rejected`,
      `approve-`,
      invoiceId.toHexString(),
      customerObj.fcmDeviceToken
    );
  } else {
    updateObject = {
      rentalPeriod: {
        start: updatedRevision.start,
        end: updatedRevision.end,
      },
      totalCharges: updatedRevision.totalCharges,
      revisions: savedRental.revisions,
      isApproved: approvalStatus,
    };
  }
  await Invoice.updateOne({ _id: invoiceId }, updateObject);
  res.status(200).send({
    success: true,
    message: approvalStatus
      ? "Successfully approved Rental Request"
      : "Sorry! Rental Request is rejected",
    approvalStatus: approvalStatus,
  });
}

async function calculateCharges(revisionId, requestType, rental) {
  return new Promise(async (resolve, reject) => {
    let paidAmount = 0,
      amountToPay = 0;
    if (requestType === "reschedule") {
      rental.revisions.forEach((revision, revisionIndex) => {
        if (revision) {
          // revision = revision._doc;
          if (revision._id.toString() === revisionId) {
            if (revision.revisionType === "rental") {
              paidAmount = revision.transactionAmount || 0;
            }

            if (revision.revisionType === "reschedule") {
              const total = revision.totalCharges
                ? revision.totalCharges.total
                : 0;
              amountToPay = total - paidAmount;
            }
          }
        }
      });
    }

    resolve(amountToPay);
  });
}

module.exports = manageRentalApproval;
