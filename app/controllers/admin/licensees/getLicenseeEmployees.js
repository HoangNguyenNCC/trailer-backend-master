const dotenv = require("dotenv");

const Employee = require("../../../models/employees");

const objectMinusKeys = require("../../../helpers/objectMinusKeys");
const { getSearchCondition } = require('../../../helpers/getSearchCondition');
const { BadRequestError } = require("../../../helpers/errors");

/** 
 * 
 *  
 * @api {GET} /employees Get all employees
 * @apiName LA - Get all employees
 * @apiGroup Licensee App - Employee
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} Authorization Authorization Token
 * 
 * 
 * @apiDescription API Endpoint GET /employees
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Employees List",
        errorsList: []
    }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} employeeList List of Employees
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 OK
 * 
    {
        success: true,
        message: "Successfully fetched Employees List",
        employeeList: []
    }
 * 
 * 
 */
async function getLicenseeEmployees(req, res, next) {
  let searchCondition = {}
    if (!req.query.id) {
      throw new BadRequestError('Unauthorised Access')
    }
    if(req.query && Object.keys(req.query).length > 0){
      const filters = [{filter:"emailVerified", search:"isEmailVerified"},{filter:"mobileVerified", search:"isMobileVerified"},{filter:"dlVerified", search:"driverLicense.verified"},{filter:"accepted", search:"driverLicense.accepted"},{filter:"state", search:"driverLicense.state"},{filter:"isOwner", search:"isOwner"},{filter:"acl", search:"acl"}]
      const search = [{condition:"email", search:"email"},{condition:"mobile", search:"mobile"}]
      searchCondition = await getSearchCondition(req.query,search,filters)
      searchCondition['licenseeId'] = req.query.id;
      searchCondition['isDeleted'] = false
      if(searchCondition.mobile){
        searchCondition['mobile']  = `+${searchCondition.mobile}` 
     }
    }

    let employees = await Employee.find(
      searchCondition
    );
    // console.log('Employees : ' + employees)
    // employees.forEach((employee, employeeIndex) => {
    //   employee = employee._doc;
    //   employee = objectMinusKeys(employee, ["password"]);

    //   employees[employeeIndex] = employee;
    // });

    // -----------------------------------------------------------------------------------------

    res.status(200).send({
      success: true,
      message: "Successfully fetched Employees List",
      employeeList: employees,
    });
  
}

module.exports = getLicenseeEmployees;
