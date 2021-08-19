const Invoice = require('../../../models/invoices');
const Licensee = require('../../../models/licensees');
const User = require('../../../models/users');
const Trailer = require('../../../models/trailers');
const UpsellItem = require('../../../models/upsellItems');

const getAllDeliveredRentals = async (req, res) => {

   const invoices = await Invoice.find({rentalStatus: 'delivered'}, {_id: 1, licenseeId: 1, bookedByUserId: 1, rentalPeriod: 1, totalCharges: 1, rentedItems: 1, driverLicenseScan: 1}).lean(); 

        const resultInvoices = [];

        for (let invoice of invoices) {
            const licensee = await Licensee.findById(invoice.licenseeId).lean();
            const user = await User.findById(invoice.bookedByUserId).lean();

            const rentedItems = [];
            for (let rentedItem of invoice.rentedItems) {
                if (rentedItem.itemType === 'trailer') {
                    const trailer = await Trailer.findById(rentedItem.itemId).lean();
                    rentedItems.push({
                        ...trailer,
                        itemType: rentedItem.itemType
                    });
                } else if (rentedItem.itemType === 'upsellitem') {
                    const upsellItem = await UpsellItem.findById(rentedItem.itemId).lean();
                    rentedItems.push({
                        ...upsellItem,
                        itemType: rentedItem.itemType
                    });
                }
            }

            const newInvoice = {
                ...invoice,
                licensee,
                user,
                rentedItems
            };

            resultInvoices.push(newInvoice);

        }

        return res.json({
            success: true,
            invoices: resultInvoices
        });

};

module.exports = getAllDeliveredRentals;