const signIn = require('./signIn');

const generateOTP = require('./generateOTP');
const verifyOTP = require('./verifyOTP');

const verifyEmail = require('./verifyEmail')
const resendEmailverification = require('./resendEmailVerification')

const inviteEmployee = require('./inviteEmployee');
const resendinvite = require('./resendinvite.js');
const saveEmployee = require('./saveEmployee');
const updateEmployee = require('./updateEmployee');
const updateEmployeeByAdmin = require('./updateEmployeeByAdmin');

const getEmployee = require('./getEmployee');
const getEmployees = require('./getEmployees');
const getAllAdmins = require('./allAdminEmployee')
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');

const getAccessControlList = require('./getAccessControlList');
const asyncHandler = require('../../../helpers/asyncHandler');

module.exports = {
    signIn : asyncHandler(signIn),
    generateOTP  : asyncHandler(generateOTP),
    verifyOTP : asyncHandler(verifyOTP),
    verifyEmail : asyncHandler(verifyEmail),
    resendEmailverification : asyncHandler(resendEmailverification),
    inviteEmployee : asyncHandler(inviteEmployee),
    resendinvite : asyncHandler(resendinvite),
    saveEmployee : asyncHandler(saveEmployee),
    updateEmployee : asyncHandler(updateEmployee),
    updateEmployeeByAdmin : asyncHandler(updateEmployeeByAdmin),
    getEmployee : asyncHandler(getEmployee),
    getEmployees : asyncHandler(getEmployees),
    getAllAdmins : asyncHandler(getAllAdmins),
    forgotPassword : asyncHandler(forgotPassword),
    resetPassword : asyncHandler(resetPassword),
    getAccessControlList : asyncHandler(getAccessControlList)
};