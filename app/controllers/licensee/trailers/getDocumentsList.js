const mongoose = require('mongoose');


const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');
const TrailerInsurance = require('../../../models/trailerInsurance');
const TrailerServicing = require('../../../models/trailerServicing');
const Invoice = require('../../../models/invoices');
const User = require('../../../models/users');
const Licensee = require('../../../models/licensees');

const aclSettings = require('../../../helpers/getAccessControlList');
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
 * @api {GET} /licensee/docs Get Documents List
 * @apiName LA - Get Documents List
 * @apiGroup Licensee App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} type Type of a Document ( "insurance", "servicing", "proofOfIncorporation", "license" )
 * @apiParam {String} count Count of Trailers to fetch
 * @apiParam {String} skip Number of Trailers to skip
 * 
 * 
 * @apiDescription API Endpoint GET /licensee/docs
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} documentList List of Documents
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Documents List",
        documentsList: []
    }
 * 
 * 
 * Sample API Call : http://localhost:5000/licensee/docs?type=insurance&count=10&skip=0
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Documents List",
        errorsList: []
    }
 * 
 * 
 */
async function getDocumentsList(req, res, next) {
        if (!req.requestFrom || !aclSettings.validateACL(req.requestFrom.acl, "DOCUMENTS", "VIEW") || !req.requestFrom.licenseeId) {
            throw new ForbiddenError('Unauthorised Access')
        }

        const typeOfDocument = (req.query && req.query.type) ? req.query.type : constants.docType;
        const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
        const licenseeId = (typeof req.requestFrom.licenseeId === 'string') ? mongoose.Types.ObjectId(req.requestFrom.licenseeId) : req.requestFrom.licenseeId;

        const trailersList = {};
        const trailersIds = [];
        const upsellItemsList = {};
        const upsellItemIds = [];
        if(typeOfDocument === "insurance" || typeOfDocument === "servicing") {
            const trailers = await Trailer.find({ licenseeId: licenseeId, isDeleted: false }, { _id: 1, name: 1 });
            trailers.forEach((trailer) => {
                trailersIds.push(trailer._id);
                trailersList[trailer._id.toString()] = trailer.name;
            });

            const upsellItems = await UpsellItem.find({ licenseeId: licenseeId, isDeleted: false }, { _id: 1, name: 1 });
            upsellItems.forEach((upsellItem) => {
                upsellItemIds.push(upsellItem._id);
                upsellItemsList[upsellItem._id.toString()] = upsellItem.name;
            });
        }
        const itemIds = [...trailersIds, ...upsellItemIds];

        let documentsList = [];
        if(typeOfDocument === "insurance") {
            const insuranceProj = TrailerInsurance.getAllFieldsExceptFile();
            const trailerInsurance = await TrailerInsurance.find({ itemId: { $in: itemIds } }, insuranceProj)
                .skip(pageSkip)
                .limit(pageCount);

            trailerInsurance.forEach((insurance, index) => {
                documentsList.push({
                    _id: insurance._id,
                    typeOfDocument: typeOfDocument,
                    itemType: insurance.itemType,
                    itemName: (insurance.itemType === "trailer") ? trailersList[insurance.itemId] : upsellItemsList[insurance.itemId],
                    doc: insurance.document
                });
            });
        } else if(typeOfDocument === "servicing") {
            const servicingProj = TrailerServicing.getAllFieldsExceptFile();
            const trailerServicing = await TrailerServicing.find({ itemId: { $in: itemIds } }, servicingProj)
                .skip(pageSkip)
                .limit(pageCount);

            trailerServicing.forEach((servicing, index) => {
                documentsList.push({
                    _id: servicing._id,
                    typeOfDocument: typeOfDocument,
                    itemType: servicing.itemType,
                    itemName: (servicing.itemType === "trailer") ? trailersList[servicing.itemId] : upsellItemsList[servicing.itemId],
                    doc: servicing.document
                });
            });
        } else if(typeOfDocument === "proofOfIncorporation") {
            const licensee = await Licensee.findOne({ _id: licenseeId }, { name: 1 });

            if(licensee && licensee.proofOfIncorporation) {
                documentsList.push({
                    _id: licenseeId,
                    typeOfDocument: typeOfDocument,
                    licenseeName: licensee.name,
                    doc: licensee.proofOfIncorporation
                });
            }
        }  else if(typeOfDocument === "license") {
            const invoices = await Invoice.find({ licenseeId: licenseeId }, { bookedByUserId: 1 });
            
            const userIds = [];
            invoices.forEach((invoice) => {
                invoice = invoice._doc;
                userIds.push(invoice.bookedByUserId);
            });

            // const users = await User.find({ _id: { $in: userIds } }, { driverLicense: 1, name: 1 });
            
            const userProj = User.getAllFieldsSpecified(["driverLicense.scan", "name"]);
            const users = await User.aggregate([
                { $match: { _id: { $in: userIds } } },
                { $project: userProj }
            ]).exec();

            users.forEach((user, index) => {
                if (user && user.driverLicense && user.driverLicense.scan) {
                    documentsList.push({
                        _id: user._id,
                        typeOfDocument: typeOfDocument,
                        customerName: user.name,
                        doc: user.driverLicense
                    });
                }
            });
        }

        res.status(200).send({
            success: true,
            message: "Successfully fetched Documents List",
            documentsList: documentsList
        });
}

module.exports = getDocumentsList;