const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const Trailer = require('../../../models/trailers');
const TrailerType = require('../../../models/trailerTypes');
const UpsellItem = require('../../../models/upsellItems');
const TrailerInsurance = require('../../../models/trailerInsurance');
const TrailerServicing = require('../../../models/trailerServicing');

const aclSettings = require('../../../helpers/getAccessControlList');
const asyncForEach = require('../../../helpers/asyncForEach');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const constants = require('../../../helpers/constants');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

/** 
 * 
 * @api {POST} /trailer Save or Update Trailer Information
 * @apiName LA - Save or Update Trailer Information
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {FilesArray} photos Photos of the Trailer ( Files )
 * @apiParam {File} insuranceDocument Insurance Certificate ( File )
 * @apiParam {File} servicingDocument Servicing Certificate ( File )
 * 
 * @apiParam {Object} reqBody Request JSON data
 * @apiParam {String} _id Id of the Trailer ( application to update requests only )
 * @apiParam {String} name Name of the Trailer
 * @apiParam {String} vin VIN of the Trailer
 * @apiParam {String} type Type of the Trailer
 * @apiParam {String} description Description of the Trailer
 * @apiParam {String} size Size of the Trailer
 * @apiParam {String} capacity Capacity of the Trailer
 * @apiParam {String} tare Tare of the Trailer ( Weight of the Trailer before loading goods )
 * @apiParam {Integer} age Age of the Trailer
 * 
 * @apiParam {Array} features Features of the Trailer
 * 
 * @apiParam {Boolean} availability Availability of the Trailer
 *
 * @apiParam {String} adminRentalItemId Rental Item Id of the Admin Rental Item record for Reference
 * 
 * @apiParam {Array} upsellItems List of Upsell Item Ids added for Trailer
 * 
 * @apiParam {Object} insurance Insurance Object
 * @apiParam {String} insurance[issueDate] Date of Insurance Issue ( "YYYY-MM-DD" format )
 * @apiParam {String} insurance[expiryDate] Date of Insurance Expiry ( "YYYY-MM-DD" format )
 * 
 * 
 * @apiParam {Object} servicing Servicing Object
 * @apiParam {String} servicing[name] Name of the Service
 * @apiParam {String} servicing[serviceDate] Date of Servicing ( "YYYY-MM-DD" format )
 * @apiParam {String} servicing[nextDueDate] Next Due Date of Servicing ( "YYYY-MM-DD" format )
 * 
 * 
 * @apiDescription API Endpoint that can used to save or update Trailer data
 * 
 * 
 * Request Headers
 * - 'Content-Type: application/json'
 * 
 * Request Body ( Example )  ( request.body )
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request POST 'http://trailer2you.herokuapp.com/trailer' \
    --form 'photos=@/home/user/Downloads/3500kg_car_trailer.jpg' \
    --form 'photos=@/home/user/Downloads/2000kg_car_trailer.jpg' \
    --form 'insurance.document=@/home/user/Downloads/automobile-insurance.jpg' \
    --form 'servicing.document=@/home/user/Downloads/automobile-servicing.jpg' \
    --form 'reqBody={
        "availability": true,
        "age": 3,
        "vin": "12345678",
        "adminRentalItemId": "5e96b42e57576e25f1594af7",
            
        "name": "Tandem Axle Box Trailer",
        "type": "cage-trailer",
        "description": "tandem axle box trailer, this will be fitted with a cage, this will be available in 10 x 6. Attached is a photo of the trailer without the cage. The range of heavy duty hot dip galvanised trailers are made tough for Australian conditions. Whether you are carrying a load up the road or across the country you want to rely on the trailer you own to do the job. Our trailers are built to last. Australian made for Australian conditions, and come with unbeatable 2 year Warranty and FREE 2 years Roadside Assist",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",

        "features": [
            "hot dip galvanised",
            "checker plate floor",
            "full chassis",
            "longer drawbar",
            "jockey wheel clamp",
            "spare wheel bracket",
            "new wheels and tyres",
            "LED lights",
            "magnetic trailer plug"
        ],

        "size": "6'\'' x 4'\'' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7'\'' x 4'\'' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.",
            
        "upsellitems": ["5ec7f1f960e1475bc50b3003"],
            
        "insurance": {
            "issueDate": "2019-11-01",
            "expiryDate": "2020-11-01"
        },
        "servicing": {
            "serviceDate": "2019-11-01",
            "nextDueDate": "2020-11-01",
            "name": "Oil Refill"
        }
    }'
 * 
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 * 
   {
        success: false,
        message: "Error while saving Trailer record",
        errorsList: []
   }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} Trailer details object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200 
 * 
   {
        success: true,
        message: "Successfully saved Trailer record",
        trailerObj: {
            _id: ObjectId("5e4132b4603c2159b3e58ac0")
            name: "2020 C&B DMP610-6TA 26\"",
            vin: "123456789",
            type: "dump",
            description:
                "2 5/16\" ADJUSTABLE COUPLER, 8000# JACK, LOOSE RAMPS, SCISSOR HOIST",
            size: "Length: 10' Width: 6'",
            capacity: "6980 lbs",
            tare: "2920 lbs",
            age: 4,

            features: [
                "2 5/16\" ADJUSTABLE COUPLER",
                "8000# JACK",
            ],

            availability: true,
            licenseeId: mongoose.Types.ObjectId("5e41314d603c2159b3e58aab"),

            photos: [
               "{HOST}/file/trailer/:trailerId/:photoIndex"
            ]
        }
    }
 * 
 * 
 */
async function saveTrailer(req, res, next) {
    const uploadedFiles = [];
        if(!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "TRAILER", ["ADD", "UPDATE"])) {
            throw new BadRequestError('Unauthorised Error')
        }
        console.log(req.requestFrom)
        let trailer = req.body.reqBody;

        try{
            trailer = JSON.parse(trailer);
        }catch(err){

        }

        

        if(!trailer) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }

//         trailer = JSON.parse(trailer);

        const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
        if(req.files) {
            // Validations -------------------------------------------------------

            if(req.files["photos"]) {
                req.files["photos"].forEach(file => {
                    if(!constants.allowedfiles.documents.includes(file.mimetype)) {
                        throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
                    }
                    if(file.size > constants.maxPictureSize) {
                        throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
                    }
                });
            }
            if(req.files["insuranceDocument"]) {
                req.files["insuranceDocument"].forEach(file => {
                    if(!constants.allowedfiles.documents.includes(file.mimetype)) {
                        throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
                    }
                    if(file.size > constants.maxPictureSize) {
                        throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
                    }
                });
            }
            if(req.files["servicingDocument"]) {
                req.files["servicingDocument"].forEach(file => {
                    if(!constants.allowedfiles.documents.includes(file.mimetype)) {
                        throw new BadRequestError(`VALIDATION-Upload files with allowed file types - ${file.filename}`);
                    }
                    if(file.size > constants.maxPictureSize) {
                        throw new BadRequestError(`VALIDATION-Document Exceeded Size Limit - ${file.filename}`);
                    }
                });
            }
        }

        const trailerId = trailer._id ? mongoose.Types.ObjectId(trailer._id) : undefined;
        const isUpdating = trailer._id ? true : false;
        const existingTrailer = await Trailer.findOne({ _id: trailerId }, { licenseeId: 1 });
        if(isUpdating && (!existingTrailer || existingTrailer._doc.licenseeId.toString() !== req.requestFrom.licenseeId.toString())) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        if(!trailer) {
            throw new BadRequestError("VALIDATION-Error occurred while parsing Trailer record");
        } else {
            if(typeof trailer.address === "string") {
                trailer.address = {
                    text: trailer.address
                };
            }
            
            if(isUpdating) {
                trailer = objectMinusKeys(trailer, ['_id', 'licenseeId', 'createdAt', 'updatedAt']);
            }

            trailer.photos = [];
            if(req.files && req.files["photos"] && req.files["photos"].length > 0) {
                let photos = req.files["photos"];

                photos.forEach((photo) => {
                    const data = photo.location;
                    const contentType = photo.mimetype;

                    trailer.photos.push({
                        contentType: contentType,
                        data: data
                    });
                });
            }

            if(trailer.insurance && req.files && req.files["insuranceDocument"] && req.files["insuranceDocument"].length > 0) {
                let photo = req.files["insuranceDocument"][0];
                const data = photo.location;
                const contentType = photo.mimetype;

                trailer.insurance.document = {
                    contentType: contentType,
                    data: data
                };
            }

            if(trailer.servicing && req.files && req.files["servicingDocument"] && req.files["servicingDocument"].length > 0) {
                let photo = req.files["servicingDocument"][0];
                const data = photo.location;
                const contentType = photo.mimetype;

                trailer.servicing.document = {
                    contentType: contentType,
                    data: data
                };
            }
            
            if(trailer._id) {
                trailer._id = trailerId;
            }
            trailer.licenseeId = licenseeId;
            trailer.adminRentalItemId = (typeof trailer.adminRentalItemId === 'string') ? mongoose.Types.ObjectId(trailer.adminRentalItemId) : trailer.adminRentalItemId;

            let upsellItems;
            if(trailer.upsellitems) {
                upsellItems = [...trailer.upsellitems];
                delete trailer.upsellitems;
            }

            let insuranceObj;
            if(trailer.insurance) {
                insuranceObj = {...trailer.insurance};
                delete trailer.insurance;
            }

            let servicingObj;
            if(trailer.servicing) {
                servicingObj = {...trailer.servicing};
                delete trailer.servicing;
            }

            if(!isUpdating){
                let isPresent = await TrailerType.findById({_id:trailer.trailerModel})
                if( !isPresent){
                    throw new BadRequestError('Validation - No trailer Model registered with this Model ID')
                }
                let upsellItemsForModel = await UpsellItem.find({trailerModel: trailer.trailerModel}).lean();
                if (!upsellItemsForModel || !upsellItemsForModel.length) upsellItemsForModel = []; 
                trailer.upsellItems = upsellItemsForModel;
            }

            if(isUpdating) {
                await Trailer.updateOne({ _id: trailerId }, trailer);
                trailer = await Trailer.findOne({ _id: trailerId });
            } else {
                trailer = new Trailer(trailer);
                trailer = await trailer.save();
            }
            trailer = trailer._doc;

            if(trailer.address) {
                trailer.address = {
                    text: trailer.address ? trailer.address.text : "",
                    pincode: trailer.address ? trailer.address.pincode : "",
                    coordinates: (trailer.address && trailer.address.location) ? trailer.address.location.coordinates : undefined
                };

                trailer.address.coordinates = [trailer.address.coordinates[1], trailer.address.coordinates[0]];
            }

            if(upsellItems) {
                await asyncForEach(upsellItems, async(upsellItemId) => {
                    await UpsellItem.updateOne({ _id: mongoose.Types.ObjectId(upsellItemId) }, { trailerId: trailer._id });
                });
            }

            let trailerInsuranceDoc;
            if(insuranceObj) {
                if(!insuranceObj.issueDate || validator.isEmpty(insuranceObj.issueDate)) {
                    throw new BadRequestError("VALIDATION-Invalid Issue Date");
                }
                if(insuranceObj.issueDate) {
                    insuranceObj.issueDate = moment(insuranceObj.issueDate).toISOString();
                }

                if(!insuranceObj.expiryDate || validator.isEmpty(insuranceObj.expiryDate)) {
                    throw new BadRequestError("VALIDATION-Invalid Expiry Date");
                }
                if(insuranceObj.expiryDate) {
                    insuranceObj.expiryDate = moment(insuranceObj.expiryDate).toISOString();
                }
        
                if(!insuranceObj.document) {
                    throw new BadRequestError("VALIDATION-Invalid Document");
                }
        
                insuranceObj.licenseeId = licenseeId;
                insuranceObj.itemType = "trailer";
                insuranceObj.itemId = trailer._id;
                
                let insurance = new TrailerInsurance(insuranceObj);
                trailerInsuranceDoc = await insurance.save();
            
                trailerInsuranceDoc = trailerInsuranceDoc._doc;
            
                trailerInsuranceDoc.issueDate = moment(trailerInsuranceDoc.issueDate).format("YYYY-MM-DD");
                trailerInsuranceDoc.expiryDate = moment(trailerInsuranceDoc.expiryDate).format("YYYY-MM-DD");
            }

            let trailerServicingDoc;
            if(servicingObj) {
                if(!servicingObj.name || validator.isEmpty(servicingObj.name)) {
                    throw new BadRequestError("VALIDATION-Invalid Service Name");
                }

                if(!servicingObj.serviceDate || validator.isEmpty(servicingObj.serviceDate)) {
                    throw new BadRequestError("VALIDATION-Invalid Service Date");
                }
                if(servicingObj.serviceDate) {
                    servicingObj.serviceDate = moment(servicingObj.serviceDate).toISOString();
                }

                if(!servicingObj.nextDueDate || validator.isEmpty(servicingObj.nextDueDate)) {
                    throw new BadRequestError("VALIDATION-Invalid Next Due Date");
                }
                if(servicingObj.nextDueDate) {
                    servicingObj.nextDueDate = moment(servicingObj.nextDueDate).toISOString();
                }
        
                if(!servicingObj.document) {
                    throw new BadRequestError("VALIDATION-Invalid Document");
                }
        
                servicingObj.licenseeId = licenseeId;
                servicingObj.itemType = "trailer";
                servicingObj.itemId = trailer._id;
                
                let servicing = new TrailerServicing(servicingObj);
                trailerServicingDoc = await servicing.save();
            
                trailerServicingDoc = trailerServicingDoc._doc;
            
                trailerServicingDoc.serviceDate = moment(trailerServicingDoc.serviceDate).format("YYYY-MM-DD");
                trailerServicingDoc.nextDueDate = moment(trailerServicingDoc.nextDueDate).format("YYYY-MM-DD");
            }
            
            res.status(200).send({
                success: true,
                message: "Successfully saved Trailer record",
                trailerObj: trailer,
                upsellItemsList: upsellItems,
                insuranceObj: trailerInsuranceDoc,
                servicing: trailerServicingDoc
            });
        }
}

module.exports = saveTrailer;