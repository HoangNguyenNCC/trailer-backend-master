const { BadRequestError } = require('../../../helpers/errors');
const AdminEmployee = require('../../../models/adminEmployees');

function authenticateRequest(req, res, next) {
    const token = req.cookies['Admin-Access-Token'] || req.headers.authorization;
        const employee = AdminEmployee.verifyAuthToken(token);
        if (employee) {
            req.requestFrom = {
                employeeId: employee._id,
                isOwner: employee.isOwner,
                acl: employee.acl
            };
            next();
        } else {
            throw new BadRequestError("VALIDATION-Invalid Authorization Token sent in the Request");
        }
};

module.exports = authenticateRequest;