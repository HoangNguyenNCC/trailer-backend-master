const Invoice = require('./../../../models/invoices');
const User = require('../../../models/users');
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ApiError
  } = require("./../../../helpers/errors");

const approveOrCancelRentalRequest = async (req, res, next) => {

    if (!req.requestFrom || !req.requestFrom.licenseeId || !req.requestFrom.employeeId || !req.requestFrom.acl || !aclSettings.validateACL(req.requestFrom.acl, "RENTALSTATUS", "UPDATE")) {
        throw new ForbiddenError('Unauthorised Access')
    }

    const {
        invoiceId,
        requestStatus
    } = req.body || {};

    if (!invoiceId || !invoiceId.length) {
        throw new BadRequestError('Invalid Body')
    }

    if (!requestStatus || !requestStatus.length) {
        throw new BadRequestError('Invalid Body')
    }

    //TODO: maybe we need to link a booking with an invoice
    const invoice = await Invoice.findOne(
            {_id: invoiceId, licenseeId: req.requestFrom.licenseeId}, 
            {bookedCustomer: 1, rentalStatus: 1, revisions: 1} 
    );
    
    if (!invoiceId) {
        throw new NotFoundError('No Invoice Found')
    }

    const bookedCustomer = await User.findById(invoice.bookedByUserId).lean();

    switch(requestStatus) {
        case "approved":
            return approveRentalItem(invoice, bookedCustomer, res);
        case "rejected":
            return cancelRentalItem(invoice, bookedCustomer);
        default:
            throw new BadRequestError('Invalid Request Body')
    }
};

const approveRentalItem = (invoice, customer, res) => {

    if (invoice.rentalStatus !== 'booked') {
        throw new BadRequestError('Invalid Request Body')
    }

    const newInvoice = await Invoice.findByIdAndUpdate(invoice.id, {})

};

const cancelRentalItem = (invoice, customer) => {

};

const parseBookingStatus = bookingStatus => {
    switch(bookingStatus) {
        case "booked": return 0;
        case "cancelled": return 1;
        case "approved": return 2;
        case "dispatched": return 3;
        case "return-started": return 4;
        case "delivered": return 5;
    }
}