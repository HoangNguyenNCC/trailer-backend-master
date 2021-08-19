const getCommissions = require('./getCommissions');
const saveCommission = require('./saveCommission');

const getRentals = require('./getRentals');

const getLicenseePayouts = require('./getLicenseePayouts');
const getCustomerPayments = require('./getCustomerPayments');
const getFinancialsTrailer = require('./getFinancialsTrailer');
const getFinancialsLicensee = require('./getFinancialsLicensee');
const getFinancials = require('./getFinancials');

const manageRentalApproval = require('./manageRentalApproval');

const getTrailers = require('./getTrailers');
const getTrailer = require('./getTrailer');
const getUpsellItems = require('./getUpsellItems');
const getUpsellItem = require('./getUpsellItem');

const saveTrailer = require('./saveTrailer');
const saveUpsellItem = require('./saveUpsellItem');

const getFeatured = require('./getFeatured');
const getRentalItemTypes = require('./getRentalItemTypes');
const getRentalItemType = require('./getRentalItemType');
const saveRentalItemType = require('./saveRentalItemType');

const getLicenseeTrailers = require('./getLicenseeTrailers');
const getLicenseeUpsellItems = require('./getLicenseeUpsellItems');
const getAllDeliveredRentals = require('./getAllDeliveredRentals');
const asyncHandler = require('../../../helpers/asyncHandler');


module.exports = {
    getCommissions : asyncHandler(getCommissions),
    saveCommission : asyncHandler(saveCommission),
    getRentals : asyncHandler(getRentals),
    getLicenseePayouts : asyncHandler(getLicenseePayouts), 
    getCustomerPayments : asyncHandler(getCustomerPayments),
    getFinancialsTrailer : asyncHandler(getFinancialsTrailer),
    getFinancialsLicensee : asyncHandler(getFinancialsLicensee),
    manageRentalApproval : asyncHandler(manageRentalApproval), 
    getTrailers : asyncHandler(getTrailers),
    getTrailer : asyncHandler(getTrailer),
    getUpsellItems : asyncHandler(getUpsellItems),
    getUpsellItem : asyncHandler(getUpsellItem),
    saveTrailer : asyncHandler(saveTrailer),
    saveUpsellItem : asyncHandler(saveUpsellItem),
    getFeatured : asyncHandler(getFeatured),
    getRentalItemTypes : asyncHandler(getRentalItemTypes), 
    getRentalItemType : asyncHandler(getRentalItemType),
    saveRentalItemType : asyncHandler(saveRentalItemType), 
    getLicenseeTrailers : asyncHandler(getLicenseeTrailers),
    getLicenseeUpsellItems : asyncHandler(getLicenseeUpsellItems),
    getAllDeliveredRentals : asyncHandler(getAllDeliveredRentals),
    getFinancials : asyncHandler(getFinancials)
};
