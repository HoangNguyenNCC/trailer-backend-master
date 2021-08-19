const mongoose = require('mongoose');
const validator = require('validator');
const fs = require('fs');

const UpsellItem = require('../../../models/upsellItems');
const Trailer = require('../../../models/trailers');

const aclSettings = require('../../../helpers/getAccessControlList');
const objectMinusKeys = require('../../../helpers/objectMinusKeys');
const constants = require('../../../helpers/constants');
const trailerInsurance = require('../../../models/trailerInsurance');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

/** 
 * 
 * @api {POST} /upsellitem Save Upsell Item data
 * @apiName LA - Save Upsell Item data
 * @apiGroup Licensee App - Trailer
 *  
 * 
 * @apiHeader {String} Content-Type application/json
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {FilesArray} photos Photos of the Upsell Items ( Files )
 * 
 * @apiParam {Object} reqBody Request JSON data
 * @apiParam {String} _id Id of the Upsell Item ( application to update requests only )
 * @apiParam {String} name Name of the Upsell Item
 * @apiParam {String} type Type of the Upsell Item
 * @apiParam {String} description Description of the Upsell Item
 * @apiParam {Boolean} availability Is Upsell Item Available for Rental?
 * @apiParam {String} [trailerId] Id of the Trailer for which is reviewed by the User -> to be depreciated once required dependancies are audited
 * @apiParam {String} adminRentalItemId Rental Item Id of the Admin Rental Item record for Reference
 * @apiParam {Number} quantity Quantity of Upsell Items
 * 
 * 
 * @apiDescription API Endpoint to be used to save Upsell Item
 * 
 * 
 * @apiParamExample {json} Request-Example:
 * 
    curl --location --request POST 'http://trailer2you.herokuapp.com/upsellitem' \
    --form 'reqBody={
        "trailerId": "5ea2e292c164320017c7af14",

        "name": "Vinyl Cage Covers - 7 x 4",

        "type": "7-4-cage-cover",

        "description": "This tough vinyl cage cover tailored specifically to fit standard the trailer cage . This cover is ideal for protecting against dust and water and comes complete with bow and buttons for securing the cover to the trailer.",
        
        "availability": true
    }' \
    --form 'photos=@/home/username/Downloads/aluminium_folding_ramps.jpg'
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
 *  {
 *      success: false,
 *      message: "Error while saving Upsell Item",
 *      errorsList: []
 *  }
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Object} upsellItemObj Upsell Item details object
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
 * 
 * {
 *      success: true,
 *      message: "Successfully saved Upsell Item",
 *      upsellItemObj: {}
 * }
 * 
 * 
 */
async function saveUpsellItem(req, res, next) {
   if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "UPSELL", ["ADD", "UPDATE"])) {
            throw new BadRequestError('Unauthorise Access')
        }

        let upsellItem = req.body.reqBody;

        if(!upsellItem) {
            throw new BadRequestError("VALIDATION-Invalid Request Body");
        }
        try{
            upsellItem = JSON.parse(upsellItem);
        }catch(err){

        }
        

        const upsellItemId = upsellItem._id ? mongoose.Types.ObjectId(upsellItem._id) : undefined;
        const isUpdating = upsellItem._id ? true : false;
        const existingUpsellItem = await UpsellItem.findOne({ _id: upsellItemId }, { licenseeId: 1 });
        if(isUpdating && (!existingUpsellItem || existingUpsellItem._doc.licenseeId.toString() !== req.requestFrom.licenseeId.toString())) {
            throw new BadRequestError('Unauthorise Access')
        }

        if(!upsellItem) {
            throw new BadRequestError("VALIDATION-Data in Invalid Format");
        } else {
            if(typeof upsellItem.address === "string") {
                upsellItem.address = {
                    text: upsellItem.address
                };
            }

            const upsellItemId = upsellItem._id ? mongoose.Types.ObjectId(upsellItem._id) : undefined;
            const isUpdating = upsellItem._id ? true : false;
            if(isUpdating) {
                upsellItem = objectMinusKeys(upsellItem, ['_id', 'licenseeId', 'createdAt', 'updatedAt']);
            }
        
            if(upsellItem._id) {
                upsellItem._id = upsellItemId;
            }

            upsellItem.licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;
            if(upsellItem.adminRentalItemId) {
                upsellItem.adminRentalItemId = (typeof upsellItem.adminRentalItemId === 'string') ? mongoose.Types.ObjectId(upsellItem.adminRentalItemId) : upsellItem.adminRentalItemId;
            }

            upsellItem.photos = [];
            if(req.files["photos"] && req.files["photos"].length > 0) {
                let photos = req.files["photos"];

                photos.forEach((photo) => {
                    const data = photo.location;
                    const contentType = photo.mimetype;

                    upsellItem.photos.push({
                        contentType: contentType,
                        data: data
                    });
                });
            }

            // Save or Update data
            if(isUpdating) {
                await UpsellItem.updateOne({ _id: upsellItemId }, upsellItem);
                upsellItem = await UpsellItem.findOne({ _id: upsellItemId });
            } else {
                upsellItem = new UpsellItem(upsellItem);
                upsellItem = await upsellItem.save();
            }
            upsellItem = upsellItem._doc;

            // if(upsellItem.address) {
            //     upsellItem.address = {
            //         text: upsellItem.address ? upsellItem.address.text : "",
            //         pincode: upsellItem.address ? upsellItem.address.pincode : "",
            //         // coordinates: (upsellItem.address) ? [upsellItem.address.coordinates[1], upsellItem.address.coordinates[0]] : undefined
            //     };
            //     // upsellItem.address.coordinates = [upsellItem.address.coordinates[1], upsellItem.address.coordinates[0]];
            // }

            //Adding This Upsell to other Licensee Trailer Having Same Trailer Model
            const trailers = await Trailer.find({licenseeId:upsellItem.licenseeId,trailerModel : upsellItem.trailerModel})
            trailers.forEach(async (trailer) => {
                trailer = trailer._doc
                let newUpsell = {
                    upsellItemId : mongoose.Types.ObjectId(upsellItem._id)
                }
                let upsellItemArray = trailer.upsellItems
                if(upsellItemArray.length > 0){
                    upsellItemArray.push(newUpsell);
                }
                else{
                    upsellItemArray = [];
                    upsellItemArray.push(newUpsell);
                }
                await Trailer.update({_id:trailer._id},{$addToSet : {upsellItems : upsellItemArray }})
            })

            res.status(200).send({
                success: true,
                message: "Successfully saved Upsell Item",
                upsellItemObj: upsellItem
            });
        }
}

module.exports = saveUpsellItem;