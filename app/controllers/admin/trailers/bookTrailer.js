const Trailers = require('../../../models/trailers');
const bookTrailer = async function(req,res,next){
    try{
        if(!req.body || !req.body.trailerId){
            return res.send({
                message : 'No Trailer ID found in request'
            })
        }
        if(!req.body.startDate || !req.body.endDate){
            return res.send({
                message : 'Booking Tenure Not mentioned in request body'
            })
        }
        if(!req.body.userId){
            return res.send({
                message : 'No User ID found in request'
            })
        }
        if(!req.body.licenseeId){
            return res.send({
                message : 'No Licensee ID found in request'
            })
        }
        else{
            const trailerId = req.body.trailerId
            const trailer = await Trailers.findById(trailerId)
            if(!trailer){
                res.send({
                    message : 'No Trailer Registered With the Provided ID'
                })
            }
            else{
                trailer.availability = false 
            }
        }
    }catch(err){
        console.error("Book trailer Error", err);

        let errorCode = 500;
        let errors = [];
        let errorMessage = "Error occurred while booking trailer";

        if (err && err.name && ["MongoError", "ValidationError"].includes(err.name) && err.message) {
            errorCode = 400;
            if(err.code && err.code === 11000 && err.keyValue) {
                const keys = Object.keys(err.keyValue);
                const values = Object.values(err.keyValue);
                errorMessage = `Duplicate Key Error on { ${keys[0]}: ${values[0]} }`;
                errors.push(errorMessage);
            } else {
                errorMessage = err.message;
                errors.push(errorMessage);
            }
        } else if (err && err.message) {
            errorCode = err.message.startsWith("VALIDATION-") ? 400 : 500;
            const errorComp = err.message.split("VALIDATION-");
            errorMessage = errorComp.length > 1 ? errorComp[1] : errorComp[0];
            errors.push(errorMessage);
        } else if (err && err.errors) {
            errorCode = 400;
            const fieldKeys = Object.keys(err.errors);
            fieldKeys.forEach((fieldKey) => {
                if (fieldKey.split(".").length === 1) {
                    errors.push(err.errors[fieldKey].message);
                    if(err.errors[fieldKey].message) {
                        errorMessage = err.errors[fieldKey].message;
                    }
                }
            });
        } else {
            if(err) {
                errorMessage = err;
            }
            errors.push(err);
        }

        return res.status(errorCode).send({
            success: false,
            message: errorMessage,
            errorsList: errors
        });
    }
}

module.exports = bookTrailer
