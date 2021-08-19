const Employee = require('../../../models/employees');
const Licensee = require('../../../models/licensees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

/** 
 * 
 *  
 * @api {POST} /employee/signin Employee SignIn
 * @apiName LA - Employee SignIn
 * @apiGroup Licensee App - Licensee Authentication
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * 
 * 
 * @apiParam {String} email Email Entered By Employee (in case of licensee account use email from employee object used during signup)
 * @apiParam {String} password Password Entered By Employee
 * 
 * 
 * @apiDescription API Endpoint POST /employee/signin
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * Request Body ( Example )  ( request.body )
 * 
 *  {
 *      "email": "user1@gmail.com",
 *      "password": "1234567890"
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Please enter valid credentials",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} employeeObj Sign-in Employee object (use this for checking if mobile and number are verified)
 * @apiSuccess {Object} licenseeObj Licensee details object where employee works
 * @apiSuccess {String} token Employee Token
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully signed in!",
        dataObj: {
            employeeObj: {
            },
            licenseeObj: {
            }
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTM5NWQyZjc4NGFlMzQ0MWM5NDg2YmMiLCJpYXQiOjE1ODA4MTkxODUsImV4cCI6MTU4MTQyMzk4NX0.-Yg9zNJQvACGQ65I5xGzQ8b3YgyO1s-UIpWG_4QptKE"
        }
    }
 * 
 *
 * 
 */
async function signIn(req, res, next) {
        let checkResult = await Employee.checkValidCredentials(req.body.email, req.body.password);
        if (checkResult.errors) {
            throw new BadRequestError("VALIDATION-Please enter valid credentials");
        } else {
            let employee = checkResult.employee;
            const token = await employee.newAuthToken();
            employee = objectMinusKeys(employee._doc, ['password']);

            const licenseeId = employee.licenseeId;

            const licenseeProj = {}
            let licensee = await Licensee.findOne({ _id: licenseeId }, licenseeProj);
            if(req.body.fcmDeviceToken) {
                await Employee.updateOne({ _id: employee._id }, { fcmDeviceToken: req.body.fcmDeviceToken });
            }
            licensee = licensee._doc;

            if(licensee.address) {
                licensee.address = licensee.address._doc;
                licensee.address.coordinates = licensee.address.location._doc.coordinates;
                licensee.address.coordinates = [licensee.address.coordinates[1], licensee.address.coordinates[0]];
                delete licensee.address.location;
                delete licensee.address._id;
            }

            if(licensee.licenseeLocations && licensee.licenseeLocations.length > 0 && licensee.licenseeLocations[0] !== null) {
                licensee.licenseeLocations.forEach((licenseeLocation, licenseeLocationIndex) => {
                    licenseeLocation = licenseeLocation._doc;
                    const coordinates = licenseeLocation.location._doc.coordinates;
                    licensee.licenseeLocations[licenseeLocationIndex] = {
                        ...licenseeLocation,
                        coordinates: [coordinates[1], coordinates[0]]
                    };
                    delete licensee.licenseeLocations[licenseeLocationIndex].location;
                    delete licensee.licenseeLocations[licenseeLocationIndex]._id;
                });
            } else {
                licensee.licenseeLocations = [licensee.address];
            }

            res.cookie('Licensee-Access-Token', token, { httpOnly: true, expires: 0 });
            res.status(200).send({
                success: true,
                message: "Successfully signed in!",
                employeeObj: employee,
                licenseeObj: licensee,
                token: token
            });
        }
}

module.exports = signIn;