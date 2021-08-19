const User = require("../../../models/users");

/**
 * 
 * @api {DELETE} /user/:email Delete a Customer
 * @apiName CA - Delete a Customer
 * @apiGroup Customer App - User
 * 
 * 
 * @apiParam {String} email Email of the Customer
 * 
 * 
 * @apiDescription API Endpoint /user/:email that can be used to delete a Customer
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
    {
        success: false,
        message: "Could not delete Customer",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 *
    {
        success: true,
        message: "Success"
    }
 * 
 */
async function deleteUser(req, res) {
  const email = req.params ? req.params.email : undefined;

  await User.deleteOne({ email: email });

  return res.status(200).send({
    success: true,
    message: "Success",
  });
}

module.exports = deleteUser;
