const getCustomers = require('./getCustomers');
const getCustomer = require('./getCustomer');

const addCustomer = require('./addCustomer');
const updateCustomer = require('./updateCustomer');

const changePassword = require('./changePassword');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');

const sendOTPVerification = require('./sendOTPVerification');
const verifyOTP = require('./verifyOTP');

const sendEmailVerification = require('./sendEmailVerification');

const verifyCustomerDriverLicense = require('./verifyCustomerDriverLicense');
const asyncHandler = require('../../../helpers/asyncHandler');


module.exports = {
    getCustomers : asyncHandler(getCustomers),
    getCustomer : asyncHandler(getCustomer),
    addCustomer : asyncHandler(addCustomer),
    updateCustomer : asyncHandler(updateCustomer),
    changePassword : asyncHandler(changePassword),
    forgotPassword : asyncHandler(forgotPassword),
    resetPassword : asyncHandler(resetPassword),
    sendOTPVerification : asyncHandler(sendOTPVerification), 
    verifyOTP : asyncHandler(verifyOTP),
    sendEmailVerification : asyncHandler(sendEmailVerification),
    verifyCustomerDriverLicense : asyncHandler(verifyCustomerDriverLicense)
};