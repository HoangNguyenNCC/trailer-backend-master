const validator = require('validator');
const dotenv = require('dotenv');

const Licensees = require('../../../models/employees');

const sendMail = require('../../../helpers/sendMail');
const acl = require('../../../helpers/getAccessControlListAdmin');
const {BadRequestError} = require('../../../helpers/errors');

const licenseeInvite = async function(req,res,next){
   let body, embeddedKeys;
        body = req.body;
        if(validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
            throw new BadRequestError("VALIDATION-Invalid Email");
        }
        if(!body.acl || body.acl.length <= 0) {
            throw new BadRequestError("VALIDATION-Access Control List is Empty");
        }
        const aclTypes = Object.keys(acl.accessControlListAdmin);
        aclTypes.forEach((aclType) => {
            body.acl[aclType].forEach((privilege) => {
                if(!aclSettings.accessControlListAdmin[aclType].includes(privilege)) {
                    throw new BadRequestError(`VALIDATION-Invalid Privilege -- ${privilege}`);
                }
            });
        });
        const licenseeData = {
            email: body.email,
            acl: body.acl,
            isOwner: false,
            password: "Sample#7",
            mobile: "919876543210"
        };
        let licensee = new AdminEmployee(licenseeData);
        licensee.save();
        const token = await licensee.newEmployeeInviteToken();
        if(config.NODE_ENV !== "test") {
            const data = {
                to: employee.email,
                template: "admin-employee-invitation-email",
                subject: "Trailer2You - Admin Licensee Employee Invitation",
                context: {
                    url: `${config.ADMIN_PANEL_HOST}/admin/licensee/invite/accept?token=${token}`,
                    firstName: "User",
                    token: token
                }
            };
            sendMail(data);
        }
        res.status(200).send({
            success: true,
            message: "Successfully sent an Invitation to an Admin Employee",
            token: token,
            LicenseeObj: Licensee
        });

}

module.exports = licenseeInvite
