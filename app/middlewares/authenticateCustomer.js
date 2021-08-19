const mongoose = require("mongoose");
const User = require("./../models/users");

const { NotFoundError } = require("./../helpers/errors");
const asyncHandler = require("../helpers/asyncHandler");

async function authenticateRequest(req, res, next) {
  const token = req.cookies["User-Access-Token"] || req.headers.authorization;

  const user = User.verifyAuthToken(token);
  if (!user) throw new NotFoundError("User Not found");
  req.userId = mongoose.Types.ObjectId(user._id);
  req.fcmDeviceToken = user.fcmDeviceToken;
  next();
}

module.exports = asyncHandler(authenticateRequest);
