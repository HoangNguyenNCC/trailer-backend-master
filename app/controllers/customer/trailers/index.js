const getTrailers = require('./getTrailers');
const getTrailerDetails = require('./getTrailer');

const getUpsellItems = require('./getUpsellItems');
const getUpsellItemDetails = require('./getUpsellItem');

const getFeatured = require('./getFeatured');
const searchRentalItems = require('./searchRentalItems');
const getRentalItemTypes = require('./getRentalItemTypes');
const getFilters = require('./getFilters');
const viewTrailer = require('./viewTrailer');
const viewTrailerLicensee = require('./viewTrailerLicensee');

const getAdminTrailers = require('./getAdminTrailers');
const getAdminUpsellItems = require('./getAdminUpsellItems');

const getTrailerRentalCharges = require('./getTrailerRentalCharges');

const saveRatings = require('./saveRatings');
const saveReviews = require('./saveReviews');

const getCartDetails = require('./getCartDetails');
const getCartItem = require('./getCartItem');
const getCartItems = require('./getCartItems');
const saveCartItems = require('./saveCartItems');
const saveRentalExtension = require('./saveRentalExtension');
const saveRentalReschedule = require('./saveRentalReschedule');
const saveRentalCancellation = require('./saveRentalCancellation');

const saveInvoice = require('./saveInvoice');
const saveInvoiceTransaction = require('./saveInvoiceTransaction');
const saveInvoiceTransactionAction = require('./saveInvoiceTransactionAction');

const getNotifications = require('./getNotifications');

const saveCartTrasaction = require('./saveCartTransaction');
const saveCartItemTransaction = require('./saveCartItemTransaction');
const saveCartTransactionAction = require('./saveCartTransactionAction');
const saveCartItemTransactionAction = require('./saveCartItemTransactionAction');

const getReminders = require('./getReminders');

const createPaymentIntent = require('./createPaymentIntent');

const saveRentalItemLocationStartTracking = require('./saveRentalItemLocationStartTracking');
const saveRentalItemLocation = require('./saveRentalItemLocation');
const getRentalItemLocation = require('./getRentalItemLocation');

const bookingsController = require('./bookingsController');
const getPendingRatingsRentals = require('./getPendingRatingRentals');
const setRentalRatings = require('./setRentalRating');

const asyncHandler = require('./../../../helpers/asyncHandler');

module.exports = {
    getTrailers: asyncHandler(getTrailers),
    getTrailerDetails: asyncHandler(getTrailerDetails),
    getUpsellItems: asyncHandler(getUpsellItems),
    getUpsellItemDetails: asyncHandler(getUpsellItemDetails),
    getFeatured: asyncHandler(getFeatured),
    searchRentalItems: asyncHandler(searchRentalItems),
    getRentalItemTypes: asyncHandler(getRentalItemTypes),
    getFilters: asyncHandler(getFilters),
    viewTrailer: asyncHandler(viewTrailer),
    viewTrailerLicensee: asyncHandler(viewTrailerLicensee),
    getAdminTrailers: asyncHandler(getAdminTrailers),
    getAdminUpsellItems: asyncHandler(getAdminUpsellItems),
    getTrailerRentalCharges: asyncHandler(getTrailerRentalCharges),
    saveRatings: asyncHandler(saveRatings),
    saveReviews: asyncHandler(saveReviews),
    getCartDetails: asyncHandler(getCartDetails),
    getCartItem: asyncHandler(getCartItem),
    getCartItems: asyncHandler(getCartItems),
    saveRentalExtension: asyncHandler(saveRentalExtension),
    saveRentalCancellation: asyncHandler(saveRentalCancellation),
    saveRentalReschedule: asyncHandler(saveRentalReschedule),
    getNotifications: asyncHandler(getNotifications),
    saveInvoice: asyncHandler(saveInvoice),
    saveInvoiceTransaction: asyncHandler(saveInvoiceTransaction),
    saveInvoiceTransactionAction: asyncHandler(saveInvoiceTransactionAction),
    getReminders: asyncHandler(getReminders),
    createPaymentIntent: asyncHandler(createPaymentIntent),
    saveRentalItemLocationStartTracking: asyncHandler(saveRentalItemLocationStartTracking),
    saveRentalItemLocation: asyncHandler(saveRentalItemLocation),
    getRentalItemLocation: asyncHandler(getRentalItemLocation),
    createNewBooking: asyncHandler(bookingsController.createNewBooking),
    editBooking: asyncHandler(bookingsController.editBooking),
    markPaymentComplete: asyncHandler(bookingsController.markPaymentComplete),
    getBookingCharges: asyncHandler(bookingsController.getBookingCharges),
    saveCartTrasaction: asyncHandler(saveCartTrasaction),
    saveCartItemTransaction: asyncHandler(saveCartItemTransaction),
    saveCartTransactionAction: asyncHandler(saveCartTransactionAction),
    saveCartItemTransactionAction: asyncHandler(saveCartItemTransactionAction),
    saveCartItems: asyncHandler(saveCartItems),
    getPendingRatingRentals: asyncHandler(getPendingRatingsRentals),
    setRentalRatings: asyncHandler(setRentalRatings)
}
