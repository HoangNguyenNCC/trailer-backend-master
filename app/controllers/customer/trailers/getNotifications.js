const Notification = require('../../../models/notifications');

const constants = require('../../../helpers/constants');
const { UnauthorizedError } = require('./../../../helpers/errors');

/**
 * 
 * @api {GET} /rental/notifications Get Notifications List
 * @apiName CA - Get Notifications List
 * @apiGroup Customer App - Trailer
 * 
 * 
 * @apiHeader {String} authorization Authorization token sent as a response to signIn request
 * 
 * 
 * @apiParam {String} count Count of Notifications to fetch
 * @apiParam {String} skip Number of Notifications to skip
 * 
 * 
 * @apiDescription API Endpoint GET /rental/notifications
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message
 * @apiSuccess {Array} notificationsList List of Notifications
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Success",
        notificationsList: []
    }
 * 
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Could not fetch Notifications data",
        errorsList: []
    }
 * 
 * 
 */
async function getNotifications(req, res, next) {
    if(!req.userId) throw new UnauthorizedError('UnAuthorized Access');

    const searchCondition = {};
    const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
    const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;

    const notifications = await Notification.find(
            searchCondition, { notificationType: 1, trailerName: 1, image: 1, licensee: 1, status: 1, createdAt: 1 }
        )
        .sort({ updatedAt: -1 })
        .skip(pageSkip)
        .limit(pageCount);

    return res.status(200).send({
        success: true,
        message: "Success",
        notificationsList: notifications
    });
}

module.exports = getNotifications;