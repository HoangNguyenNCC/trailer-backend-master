const validator = require('validator');
const { BadRequestError } = require('../../../helpers/errors');

const Licensee = require('../../../models/licensees');


const licenseeDetailUpdate = async function(req,res,next){
    if(!req.body || !req.body.licenseeRef){
            throw new BadRequestError('Unauthorised Access')
        }
        const lref = req.body.licenseeRef
        const licensee = await Licensee.find({ licenseeRef : lref})
        if(!licensee){
            throw new BadRequestError('Unauthorised Access')
        }
        if(req.body.name){
            if(validator.isEmpty(req.body.name) || validator.isBoolean(req.body.name) || validator.isNumber(req.body.name)){
                throw new BadRequestError('Unauthorised Access')
            }
            licensee.name = req.body.name
        }
        if(req.body.email){
            if(!validator.isEmail(req.body.email)){
                throw new BadRequestError('Unauthorised Access')
            }
            licensee.email = req.body.email
        }
        if(req.body.mobile || req.body.phone){
            licensee.mobile = req.body.mobile || req.body.phone
        }
        if(req.files["photo"] && req.files["photo"].length > 0){
            let photo = req.files["photo"][0];
                const data = fs.readFileSync(photo.path);
                const contentType = photo.mimetype;

                licensee.photo = {
                    contentType: contentType,
                    data: data
                }
        }
        if(req.body.workingDays && req.body.workingDays.length >0){
            licensee.workingDays = req.body.workingDays
        }
        if(req.body.workingHours && !validator.isEmpty(req.body.workingHours)){
            licensee.workingHours = req.body.workingHours
        }
}

module.exports = licenseeDetailUpdate

