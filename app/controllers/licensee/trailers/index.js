const getTrailerServicing = require('./getTrailerServicing');
const getTrailerInsurance = require('./getTrailerInsurance');

const getTrailers = require('./getTrailers');
const getTrailerDetails = require('./getTrailer');
const getUpsellItems = require('./getUpsellItems');
const getUpsellItemDetails = require('./getUpsellItem');

const getAdminTrailers = require('./getAdminTrailers');
const getAdminUpsellItems = require('./getAdminUpsellItems');

const saveTrailer = require('./saveTrailer');
const saveUpsellItem = require('./saveUpsellItem');
const saveTrailerServicing = require('./saveTrailerServicing');
const saveTrailerInsurance = require('./saveTrailerInsurance');
const saveTrailerBlocking = require('./saveTrailerBlocking');
const deleteTrailer = require('./deleteTrailer');
const deleteUpsellItem = require('./deleteUpsellItem');

const saveDiscount = require('./saveDiscount');

const manageRentalApproval = require('./manageRentalApproval');
const manageRentalStatus = require('./manageRentalStatus');

const getRentalsList = require('./getRentalsList');
const getRentalDetails = require('./getRentalDetails');
const getRentalRequests = require('./getRentalRequests');
const setUserProfileRating = require('./setUserProfileRating');

const saveRentalItemLocation = require('./saveRentalItemLocation');
const getRentalItemLocation = require('./getRentalItemLocation');
const saveRentalItemLocationStartTracking = require('./saveRentalItemLocationStartTracking');

const getDocumentsList = require('./getDocumentsList');

const getReminders = require('./getReminders');

const getFinancials = require('./getFinancials');
const asyncHandler = require('../../../helpers/asyncHandler');

module.exports = {
    getTrailerServicing : asyncHandler(getTrailerServicing),
    getTrailerInsurance : asyncHandler(getTrailerInsurance),
    getTrailers : asyncHandler(getTrailers),
    getTrailerDetails : asyncHandler(getTrailerDetails),
    getUpsellItems : asyncHandler(getUpsellItems),
    getUpsellItemDetails : asyncHandler(getUpsellItemDetails),
    getAdminTrailers : asyncHandler(getAdminTrailers), 
    getAdminUpsellItems : asyncHandler(getAdminUpsellItems), 
    saveTrailer : asyncHandler(saveTrailer), 
    saveUpsellItem : asyncHandler(saveUpsellItem), 
    saveTrailerServicing : asyncHandler(saveTrailerServicing), 
    saveTrailerInsurance : asyncHandler(saveTrailerInsurance), 
    saveTrailerBlocking : asyncHandler(saveTrailerBlocking),
    deleteTrailer  : asyncHandler(deleteTrailer),
    deleteUpsellItem : asyncHandler(deleteUpsellItem),
    saveDiscount : asyncHandler(saveDiscount),  
    manageRentalApproval : asyncHandler(manageRentalApproval),
    manageRentalStatus : asyncHandler(manageRentalStatus),
    setUserProfileRating : asyncHandler(setUserProfileRating),
    getRentalsList : asyncHandler(getRentalsList), 
    getRentalDetails : asyncHandler(getRentalDetails),
    getRentalRequests  : asyncHandler(getRentalRequests), 
    saveRentalItemLocation : asyncHandler(saveRentalItemLocation),
    getRentalItemLocation : asyncHandler(getRentalItemLocation), 
    saveRentalItemLocationStartTracking : asyncHandler(saveRentalItemLocationStartTracking), 
    getDocumentsList : asyncHandler(getDocumentsList), 
    getReminders : asyncHandler(getReminders),
    getFinancials : asyncHandler(getFinancials)
}