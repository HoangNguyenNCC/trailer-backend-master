const Invoice = require('../models/invoices');
const Commission = require('../models/commissions');
const Discount = require('../models/discounts');

const TrailerType = require('../models/trailerTypes');
const UpsellItemType = require('../models/upsellItemTypes');

const rentalChargesData = require('../../test/testData/rentalChargesData');

async function calculateRentalItemCharges(itemType, trailer, delivery, startDate, endDate, doChargeDLR = true) {
    if(!trailer.rentalCharges) {
        if(trailer.adminRentalItemId) {
            let rentalItemAdminObj;
            if(itemType === "trailer") {
                rentalItemAdminObj = await TrailerType.findOne({ _id: trailer.adminRentalItemId }, { rentalCharges: 1 });
            } else if(itemType === "upsellitem") {
                rentalItemAdminObj = await UpsellItemType.findOne({ _id: trailer.adminRentalItemId }, { rentalCharges: 1 });
            }
            trailer.rentalCharges = rentalItemAdminObj._doc.rentalCharges;
        } else {
            trailer.rentalCharges = JSON.parse(JSON.stringify(rentalChargesData));
        }
    }

    if(trailer.rentalCharges) {
        const rental = {
            isPickUp: (delivery === "pickup"),
            rentalCharges: {
                pickUp: trailer.rentalCharges.pickUp,
                door2Door: trailer.rentalCharges.door2Door
            },
            rentalPeriod: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
            },
            doChargeDLR: doChargeDLR
        };

        const commission = await Commission.findOne({ itemId: trailer.adminRentalItemId });
        const discount = await Discount.findOne({ itemId: trailer.adminRentalItemId });

        const totalCharges = Invoice.calculateCharges(rental, rental.rentalPeriod.start, rental.rentalPeriod.end, commission, discount);
        console.log("Total Charges", totalCharges);

        trailer.totalCharges = totalCharges;
        trailer.total = totalCharges.total;
    } else {
        trailer.totalCharges = {
            total: 0.00,
            rentalCharges: 0.00,
            dlrCharges: 0.00,
            t2yCommission: 0.00,
            discount: 0.00,
            lateFees: 0.00,
            cancellationCharges: 0.00,
            taxes: 0.00
        };
        trailer.total = 0.00;
    }

    return trailer;
}

module.exports = calculateRentalItemCharges;