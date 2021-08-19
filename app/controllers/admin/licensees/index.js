const getLicensees = require('./getLicensees');
const saveLicensee = require('./saveLicensee');
const updateLicensee = require('./updateLicensee');
const updateEmployee = require('./updateEmployee');

const getLicenseeTrailer = require('./getLicenseeTrailer');
const getTrailerInsurance = require('./getTrailerInsurance');
const getTrailerServicing = require('./getTrailerServicing');

const setTrailerAvailability = require('./setTrailerAvailability');
const setUpsellItemAvailability = require('./setUpsellAvailability');
const addLicenseeTrailer = require('./addLicenseTrailer');
const addLicenseeUpsellItem = require('./addLicenseeUpsellItems');
const deleteLicenseeTrailer = require('./deleteLicenseeTrailer');
const deleteLicenseeUpsellItem = require('./deleteLicenseeUpsellItem');
const getLicenseeUpsellItem = require('./getLicenseeUpsellItem');
const getLicenseeSingleEmployee = require('./getLicenseeSingleEmployee');
const resendOTP = require('./resendOTP'); 
const verifyOTP = require('./verifyOTP');
const resendEmailVerification = require('./resendVerificationEmail')
const forgotPasswordMail = require('./forgotpasswordemail');
const resendInvite = require('./resendInvite');
const deleteLicenseeEmployee = require('./deleteLicenseEmployee');

const verifyLicenseeDocument = require('./verifyLicenseeDocument');
const verifyInsuranceDocument = require('./verifyInsuranceDocument');
const verifyServicingDocument = require('./verifyServicingDocument');

const getLicenseeEmployees = require('./getLicenseeEmployees');
const getLicenseeEmployee = require('./getLicenseeEmployee');
const inviteLicenseeEmployee = require('./inviteLicenseeEmployee');
const getLicensee = require('../../licensee/user/getLicensee');
const asyncHandler = require('../../../helpers/asyncHandler');


module.exports = {
    getLicensees : asyncHandler(getLicensees),
    saveLicensee : asyncHandler(getLicensee),
    updateLicensee : asyncHandler(updateLicensee),
    updateEmployee : asyncHandler(updateEmployee),
    getLicenseeTrailer : asyncHandler(getLicenseeTrailer),
    getTrailerInsurance : asyncHandler(getTrailerInsurance),
    getTrailerServicing : asyncHandler(getTrailerServicing),
    setTrailerAvailability : asyncHandler(setTrailerAvailability),
    setUpsellItemAvailability : asyncHandler(setUpsellItemAvailability),
    addLicenseeTrailer : asyncHandler(addLicenseeTrailer),
    addLicenseeUpsellItem : asyncHandler(addLicenseeUpsellItem),
    deleteLicenseeTrailer : asyncHandler(deleteLicenseeTrailer),
    deleteLicenseeUpsellItem : asyncHandler(deleteLicenseeUpsellItem),
    getLicenseeUpsellItem  : asyncHandler(getLicenseeUpsellItem),
    getLicenseeSingleEmployee : asyncHandler(getLicenseeSingleEmployee),
    resendOTP  : asyncHandler(resendOTP),
    verifyOTP  : asyncHandler(verifyOTP),
    resendEmailVerification : asyncHandler(resendEmailVerification),
    forgotPasswordMail : asyncHandler(forgotPasswordMail),
    resendInvite : asyncHandler(resendInvite),
    deleteLicenseeEmployee : asyncHandler(deleteLicenseeEmployee),
    verifyLicenseeDocument : asyncHandler(verifyLicenseeDocument) ,
    verifyInsuranceDocument  : asyncHandler(verifyInsuranceDocument),
    verifyServicingDocument : asyncHandler(verifyServicingDocument),
    getLicenseeEmployees : asyncHandler(getLicenseeEmployees),
    getLicenseeEmployee : asyncHandler(getLicenseeEmployee),
    inviteLicenseeEmployee : asyncHandler(inviteLicenseeEmployee)
};
