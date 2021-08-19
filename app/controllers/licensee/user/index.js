const saveLicensee = require('./saveLicensee');
const updateLicensee = require('./updateLicensee');
const signIn = require('./signIn');

const sendEmailVerification = require('./sendEmailVerification');
const verifyEmail = require('./verifyEmail');
const verifyEmailEmployee = require('./verifyEmailEmployee');
const sendOTPVerification = require('./sendOTPVerification');
const verifyOTP = require('./verifyOTP');

const inviteEmployee = require('./inviteEmployee');
const saveEmployee = require('./saveEmployee');
const updateEmployee = require('./updateEmployee');

const getEmployees = require('./getEmployees');
const getEmployee = require('./getEmployee');
const deleteEmployee = require('./deleteEmployee');

const getLicensee = require('./getLicensee');

const getStripeDetails = require('./getStripeDetails');
const createStripeAccount = require('./createStripeAccount');

const changePassword = require('./changePassword');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');

const setLicenseeStatus = require('./setLicenseeStatus');
const getAccessControlList = require('./getAccessControlList');

const getLicenseeState = require('./getStateValue');
const asyncHandler = require('../../../helpers/asyncHandler');

module.exports = {
    saveLicensee : asyncHandler(saveLicensee),
    updateLicensee : asyncHandler(updateLicensee),
    signIn : asyncHandler(signIn),
    sendEmailVerification : asyncHandler(sendEmailVerification),
    verifyEmail : asyncHandler(verifyEmail),
    verifyEmailEmployee : asyncHandler(verifyEmailEmployee),
    sendOTPVerification : asyncHandler(sendOTPVerification),
    verifyOTP : asyncHandler(verifyOTP),
    inviteEmployee : asyncHandler(inviteEmployee),
    saveEmployee : asyncHandler(saveEmployee),
    updateEmployee : asyncHandler(updateEmployee),
    getEmployees : asyncHandler(getEmployees),
    getEmployee : asyncHandler(getEmployee),
    deleteEmployee : asyncHandler(deleteEmployee),    
    getLicensee : asyncHandler(getLicensee),
    getStripeDetails : asyncHandler(getStripeDetails),
    createStripeAccount : asyncHandler(createStripeAccount),
    changePassword : asyncHandler(changePassword),
    forgotPassword : asyncHandler(forgotPassword),
    resetPassword : asyncHandler(resetPassword),
    setLicenseeStatus : asyncHandler(setLicenseeStatus),
    getAccessControlList : asyncHandler(getAccessControlList),
    getLicenseeState : asyncHandler(getLicenseeState),
};