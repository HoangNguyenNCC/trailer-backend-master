const User = require("../../../models/users");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("./../../../helpers/errors");

async function changePassword(req, res) {
  let body = req.body;
  const userId = req.userId;

  if (!userId) throw new UnauthorizedError("UnAuthorized Access");

  if (!body.oldPassword)
    throw new BadRequestError("Old password should not be empty");

  if (!body.newPassword)
    throw new BadRequestError("New Password should not be empty");

  let user = await User.findOne({ _id: userId }, { email: 1 }).lean();

  if (!user) throw new NotFoundError("User not found");

  let checkResult = await User.checkValidCredentials(
    user.email,
    body.oldPassword
  );
  if (checkResult.errors) throw new BadRequestError("Old password is invalid");

  await User.updateOne({ _id: userId }, { password: body.newPassword });

  res.status(200).send({
    success: true,
    message: "Success",
  });
}

module.exports = changePassword;
