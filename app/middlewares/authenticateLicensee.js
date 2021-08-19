const asyncHandler = require('../helpers/asyncHandler');
const { BadRequestError } = require('../helpers/errors');
const Employee = require('../models/employees');

async function authenticateRequest(req, res, next) {
    const token = req.cookies['Licensee-Access-Token'] || req.headers.authorization;
        const employee = Employee.verifyAuthToken(token);
        if (employee) {
            req.requestFrom = {
                employeeId: employee._id,
                licenseeId: employee.licenseeId,
                isOwner: employee.isOwner,
                acl: employee.acl
            };
            next();
        } else {
            throw new BadRequestError("Invalid Authorization Token sent in the Request");
        }
};

module.exports = asyncHandler(authenticateRequest);