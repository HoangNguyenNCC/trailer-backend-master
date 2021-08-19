const moment = require('moment');

const Invoice = require('../../../models/invoices');
const Trailer = require('../../../models/trailers');
const Licensee = require('../../../models/licensees');

const {
    UnauthorizedError
} = require('../../../helpers/errors');

const getPendingRatingsRentals = async (req, res) => {

    if (!req.userId) throw new UnauthorizedError('UnAuthorized Access');
    
    const now = moment();
    const twoDaysBefore = moment().subtract(2, 'days');

    const pendingRentals = await Invoice.find({
        bookedByUserId: req.userId,
        isRatingsGiven: false,
        rentalStatus: 'returned',
        returnDate: {
            $gte: twoDaysBefore.toISOString()
        }
    }).lean()

    let rentals = [];

    for (let rental of pendingRentals) {
        const licensee = await Licensee.findById(rental.licenseeId, { name: 1 }).lean();
        const trailerId = rental.rentedItems.filter(item => item.itemType === 'trailer')[0].itemId;
        const trailer = await Trailer.findById(trailerId, { name: 1, photos: 1  }).lean();
        
        rentals.push({
            invoice: rental,
            licensee,
            trailer
        })
    }

    return res.json(rentals);

};

module.exports = getPendingRatingsRentals