const calculateRentalItemCharges = require('../helpers/calculateRentalItemCharges');
const { NotFoundError } = require('./errors');

// upsellitem: [{item: [Object], quantity: 1 }]
const calculateCharges = async (trailer, upsellItems, delivery, startDate, endDate, doChargeDLR = true) => {

    if (!trailer) throw new NotFoundError('Trailer required to calculate charges');
    let start = startDate;
    let end = endDate;

    if (typeof startDate !== Date) {
        start = new Date(startDate);
    }

    if (typeof endDate !== Date) {
        end = new Date(endDate);
    }

    const {totalCharges: trailerCharges} = await calculateRentalItemCharges("trailer", trailer, delivery, startDate, endDate, doChargeDLR);

    const upsellChargesMap = {};

    if (upsellItems && upsellItems.length) {
        for (let upsellItem of upsellItems) { 
            const {totalCharges: upsellCharges} = await calculateRentalItemCharges("upsellitem", upsellItem.item, delivery, startDate, endDate, doChargeDLR);
            upsellChargesMap[upsellItem.item._id] = {charges: upsellCharges, quantity: upsellItem.quantity, id: upsellItem.item._id};
        }
    }

    let totalPayableAmount = trailerCharges.total;

    Object.values(upsellChargesMap).forEach(upsellItem => {
        console.log('upsell', JSON.stringify(upsellItem));
        const totalUpsellCharges = upsellItem.charges.total * upsellItem.quantity;
        totalPayableAmount += totalUpsellCharges;
        upsellChargesMap[upsellItem.id].payable = totalUpsellCharges
    });

    return {
        totalPayableAmount,
        trailerCharges,
        upsellCharges: upsellChargesMap
    }
}

module.exports = calculateCharges;