const { BadRequestError } = require('../../../helpers/errors');
const Employee = require('../../../models/employees');


const validateLicenseeDrivingLicense = async function(req,res,next){
    if(!req.body || req.body.licenseeID){
            throw new BadRequestError('Unauthorised Access')
        }
        const licensee = await Employee.find({licenseeId:req.body.licenseeID})
        if(!licensee){
            throw new BadRequestError('Unauthorised Access')
        }
        else{
            licensee.driverLicense.verified = true
            res.status(200).send({
                success : true,
                message : 'Licensee Employee Driving License Verified',
                licenseeObj : licensee.driverLicense
            })
        }
    
}

module.exports = validateLicenseeDrivingLicense

