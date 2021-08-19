const signUp = require("./signUp");
const signIn = require("./signIn");
const forgotPassword = require("./forgotPassword");
const resetPassword = require("./resetPassword");
const changePassword = require("./changePassword");

const updateUser = require("./updateUser");
const getUser = require("./getUser");
const getProfile = require("./getProfile");
const deleteUser = require("./deleteUser");

const verifyEmail = require("./verifyEmail");
const signUpVerify = require("./signUpVerify");
const sendEmailVerification = require("./sendEmailVerification");
const sendOTPVerification = require("./sendOTPVerification");

const asyncHandler = require("./../../../helpers/asyncHandler");

module.exports = {
  signUp: asyncHandler(signUp),
  signIn: asyncHandler(signIn),
  forgotPassword: asyncHandler(forgotPassword),
  resetPassword: asyncHandler(resetPassword),
  changePassword: asyncHandler(changePassword),
  sendEmailVerification: asyncHandler(sendEmailVerification),
  signUpVerify: asyncHandler(signUpVerify),
  verifyEmail: asyncHandler(verifyEmail),
  sendOTPVerification: asyncHandler(sendOTPVerification),
  getProfile: asyncHandler(getProfile),
  getUser: asyncHandler(getUser),
  updateUser: asyncHandler(updateUser),
  deleteUser: asyncHandler(deleteUser),
};
