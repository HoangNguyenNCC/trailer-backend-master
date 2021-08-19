const moment = require('moment');

const Invoice = require('../models/invoices');
const User = require('../models/users');
const Trailer = require('../models/trailers');
const UpsellItem = require('../models/upsellItems');
const Counter = require('../models/counters');

const { Types: {ObjectId} } = require('mongoose');
const calculateCharges = require('./calculateCharges');

const createInvoice = async invoiceData => {

    const { userId , objRental } = invoiceData;

    const customer = await User.findById(userId);
    if (!customer) throw new Error('No customer found for ID');

    const invoiceBody = {
        description: objRental.description,
        bookedByUserId: userId,
        licenseeId: ObjectId(objRental.licenseeId),
        doChargeDLR: objRental.doChargeDLR,
        isPickUp: objRental.isPickup,
        rentedItems: [],
        total: 0,
        bookingId: objRental.bookingId
    };

    if (objRental && objRental.rentalPeriod 
        && objRental.rentalPeriod.start && objRental.rentalPeriod.end) 
    {
        const rentalPeriodStart = moment(objRental.rentalPeriod.start);
        const rentalPeriodEnd = moment(objRental.rentalPeriod.end);

        invoiceBody.rentalPeriod = {
            start: rentalPeriodStart.toISOString(),
            end: rentalPeriodEnd.toISOString()
        };
    }

    const trailer = await Trailer.findById(objRental.trailerId);
    if (!trailer) throw new Error (`Trailer with ID ${objRental.trailerId} not found`);

    const upsellItems = [];
    for (let item of objRental.upsellItems) {
        const upsellItem = await UpsellItem.findById(item.id);
        if (!upsellItem) throw new Error(`Upsell Item not found`);
        upsellItems.push({
            id: item.id,
            quantity: item.quantity,
            item: upsellItem,
        });
    }

    const deliveryType = objRental.isPickup ? "pickup": "door2door";

    const charges = await calculateCharges(trailer, upsellItems, deliveryType, new Date(objRental.rentalPeriod.start), new Date(objRental.rentalPeriod.end), objRental.doChargeDLR);

    invoiceBody.total = charges.totalPayableAmount;

    invoiceBody.rentedItems.push({
        itemType: "trailer",
        itemId: objRental.trailerId,
        units: 1,
        totalCharges: charges.trailerCharges
    });

    for (let item of upsellItems) {
        invoiceBody.rentedItems.push({
            itemType: "upsellitem",
            itemId: item.id,
            units: item.quantity,
            totalCharges: charges.upsellCharges[item.id]
        });
    }

    invoiceBody.charges = charges;
    invoiceBody.charges.upsellCharges = Object.values(invoiceBody.charges.upsellCharges);

    console.log('charges', JSON.stringify(invoiceBody.charges));

    invoiceBody.pickUpLocation = {
        text: objRental.pickUpLocation.text,
        pincode: objRental.pickUpLocation.pincode,
        location: {
            type: "Point",
            coordinates: [objRental.pickUpLocation.coordinates[1], objRental.pickUpLocation.coordinates[0]]
        }
    }

    if (!objRental.dropOffLocation)
        invoiceBody.dropOffLocation = { ...invoiceBody.pickUpLocation };
    else {
        invoiceBody.dropoffLocation = {
            text: objRental.dropOffLocation.text,
            pincode: objRental.dropOffLocation.pincode,
            location: {
                type: "Point",
                coordinates: [objRental.dropOffLocation.coordinates[1], objRental.dropOffLocation.coordinates[0]]
            }
        }
    }

    const invoiceNumber = await Counter.getNextSequence("invoiceNumber");
    invoiceBody.invoiceNumber = invoiceNumber;

    invoiceBody.invoiceReference = `INV${(invoiceNumber.toString()).padStart(10, '0')}`;

    invoiceBody.revisions = [{
        revisionType: "rental",
        start: invoiceBody.rentalPeriod.start,
        end: invoiceBody.rentalPeriod.end,
        requestOn: moment().toISOString(),
        requestUpdatedOn: moment().toISOString(),
        charges
    }];

    return new Invoice(invoiceBody).save();
};

module.exports = createInvoice;