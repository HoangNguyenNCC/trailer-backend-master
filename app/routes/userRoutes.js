const express = require("express");
const router = express.Router();

const {
  customerTrailerController,
  customerUserController,
} = require("./../controllers");

const authMiddleware = require("./../middlewares/authenticateCustomer");

const uploadSetup = require("../helpers/uploadSetup");

const postSignupMW = uploadSetup.fields([
  { name: "photo", maxCount: 1 },
  { name: "driverLicenseScan", maxCount: 1 },
]);

// ======== START - USER RELATED ROUTES ========== //
router.post("/signup", postSignupMW, customerUserController.signUp);

router.post("/signin", customerUserController.signIn);

router.put("/forgotpassword", customerUserController.forgotPassword);

router.put("/resetpassword", customerUserController.resetPassword);

router.put(
  "/user/password/change",
  authMiddleware,
  customerUserController.changePassword
);

router.post(
  "/customer/email/verify",
  authMiddleware,
  customerUserController.sendEmailVerification
);

router.post("/signup/verify", customerUserController.signUpVerify);

router.get("/customer/email/verify", customerUserController.verifyEmail);

router.post("/signup/otp/resend", customerUserController.sendOTPVerification);

router.get("/profile", authMiddleware, customerUserController.getProfile);

router.get("/user", authMiddleware, customerUserController.getUser);

router.put(
  "/user",
  authMiddleware,
  postSignupMW,
  customerUserController.updateUser
);

router.delete(
  "/user/:email",
  authMiddleware,
  customerUserController.deleteUser
);
// ======== END - USER RELATED ROUTES ======== //

// ======== START - RENTAL RELATED ROUTES ========== //
router.get("/trailers", authMiddleware, customerTrailerController.getTrailers);

router.get(
  "/trailer",
  authMiddleware,
  customerTrailerController.getTrailerDetails
);

router.get(
  "/upsellitems",
  authMiddleware,
  customerTrailerController.getUpsellItems
);

router.get(
  "/upsellitem",
  authMiddleware,
  customerTrailerController.getUpsellItemDetails
);

router.get("/featured", authMiddleware, customerTrailerController.getFeatured);

router.post(
  "/search",
  authMiddleware,
  customerTrailerController.searchRentalItems
);

router.get(
  "/rentalitemtypes",
  authMiddleware,
  customerTrailerController.getRentalItemTypes
);

router.get(
  "/rentalitemfilters",
  authMiddleware,
  customerTrailerController.getFilters
);

router.post(
  "/trailer/view",
  authMiddleware,
  customerTrailerController.viewTrailer
);

router.get(
  "/trailer/licensee",
  authMiddleware,
  customerTrailerController.viewTrailerLicensee
);

router.get(
  "/trailers/admin",
  authMiddleware,
  customerTrailerController.getAdminTrailers
);

router.get(
  "/upsellitems/admin",
  authMiddleware,
  customerTrailerController.getAdminUpsellItems
);

router.get(
  "/trailer/:id/rentalcharges",
  authMiddleware,
  customerTrailerController.getTrailerRentalCharges
);

router.post("/rating", authMiddleware, customerTrailerController.saveRatings);

router.post("/review", authMiddleware, customerTrailerController.saveReviews);

router.get("/cart", authMiddleware, customerTrailerController.getCartDetails);

router.get("/rental", authMiddleware, customerTrailerController.getCartItem);

router.get("/rentals", authMiddleware, customerTrailerController.getCartItems);

router.post("/rental", authMiddleware, customerTrailerController.saveCartItems);

router.post(
  "/rental/extend",
  authMiddleware,
  customerTrailerController.saveRentalExtension
);

router.post(
  "/rental/cancel",
  authMiddleware,
  customerTrailerController.saveRentalCancellation
);

router.post(
  "/rental/reschedule",
  authMiddleware,
  customerTrailerController.saveRentalReschedule
);
router.post(
  "/rental/edit",
  authMiddleware,
  customerTrailerController.editBooking
); //this will replace reschedule, extend (and to add, cancelation)

router.get(
  "/rental/notifications",
  authMiddleware,
  customerTrailerController.getNotifications
);

router.post("/invoice", customerTrailerController.saveInvoice);

router.put(
  "/invoice/transaction",
  authMiddleware,
  customerTrailerController.saveInvoiceTransaction
);

router.put(
  "/invoice/transaction/action",
  authMiddleware,
  customerTrailerController.saveInvoiceTransactionAction
);

router.put(
  "/cart/transaction",
  authMiddleware,
  customerTrailerController.saveCartTrasaction
);

router.put(
  "/rental/transaction",
  authMiddleware,
  customerTrailerController.saveCartItemTransaction
);

router.put(
  "/cart/transaction/action",
  authMiddleware,
  customerTrailerController.saveCartTransactionAction
);

router.put(
  "/rental/transaction/action",
  authMiddleware,
  customerTrailerController.saveCartItemTransactionAction
);

// ----------------------------------------------------------------------

router.get(
  "/user/reminders",
  authMiddleware,
  customerTrailerController.getReminders
);

router.post(
  "/create-payment-intent",
  authMiddleware,
  customerTrailerController.createPaymentIntent
);

// ----------------------------------------------------------------------

router.post(
  "/user/rental/location/track",
  authMiddleware,
  customerTrailerController.saveRentalItemLocationStartTracking
);

router.post(
  "/user/rental/location",
  authMiddleware,
  customerTrailerController.saveRentalItemLocation
);

router.get(
  "/user/rental/locations",
  authMiddleware,
  customerTrailerController.getRentalItemLocation
);

// ----------------------------------------------------------------------
router.post(
  "/booking",
  authMiddleware,
  customerTrailerController.createNewBooking
);
// No auth middleware cuz this route is invokbed by stripe and the auth part is taken care of using the stripe secret
router.post(
  "/booking/stripe-webhook",
  customerTrailerController.markPaymentComplete
);
1;
router.post(
  "/booking/charges",
  authMiddleware,
  customerTrailerController.getBookingCharges
);
// ======== END - RENTAL RELATED ROUTES ========== //

router.get('/getPendingRatingRentals', authMiddleware, customerTrailerController.getPendingRatingRentals);
router.post('/setRatings', authMiddleware, customerTrailerController.setRentalRatings);

module.exports = router;
