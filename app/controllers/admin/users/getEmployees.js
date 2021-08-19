const AdminEmployee = require('../../../models/adminEmployees');

const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const { getSearchCondition } = require('../../../helpers/getSearchCondition');
const { BadRequestError } = require('../../../helpers/errors');

/** 
 * 
 *  
 * @api {GET} /admin/employees Get all employees of Admin
 * @apiName TAAU - Get all employees of Admin
 * @apiGroup Admin App - AdminUser
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} Authorization Authorization Token
 * 
 * 
 * @apiDescription API Endpoint GET /admin/employees
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
async function getEmployee(req, res) {
   if (!req.requestFrom || !req.requestFrom.isOwner) {
    throw new BadRequestError('Unauthorised Access')
    }
        let searchCondition = {}
        if(req.query && Object.keys(req.query).length > 0){
            const filters = [{filter:"acl", search:"acl"}]
            const search = [{condition:"email", search:"email"},{condition:"mobile", search:"mobile"}]
            searchCondition = await getSearchCondition(req.query,search,filters)
        }
        // -----------------------------------------------------------------------------------------
        
        let employees = await AdminEmployee.find(searchCondition);
        employees.forEach((employee, employeeIndex) => {
            employee = employee._doc;
            employees[employeeIndex] = objectMinusKeys(employee, ['password']);

            // employees[employeeIndex].photo = getFilePath("adminemployeephoto", employee._id.toString()); //TODO: No photo in admin employee schema
        });
    
        // -----------------------------------------------------------------------------------------
    
        res.status(200).send({
            success: true,
            message: "Successfully fetched Employees List",
            employeeList: employees
        });
}

module.exports = getEmployee;