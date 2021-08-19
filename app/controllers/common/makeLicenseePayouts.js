const nodeCron = require('node-cron');
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Invoice = require('../../models/invoices');
const Licensee = require('../../models/licensees');
const LicenseePayout = require('../../models/licenseePayouts');
const Counter = require('../../models/counters');

const asyncForEach = require('../../helpers/asyncForEach');
const stripe = require('stripe')(config.STRIPE_SECRET);

/*

 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # * * * * * *

    Everyday at 12am
    0 0 0 * * *

    Every 5 minutes
    '0 *\/5 * * * *'

 */
async function startLicenseePayoutCron() {
    // nodeCron.schedule('0 */2 * * * *', async function() {
    nodeCron.schedule('59 59 23 * * *', async function() {
        try {
        
            const currentDate = moment();
            const periodStart = moment().startOf("year");
            // const periodStart = currentDate.startOf("day");
            const periodEnd = moment().endOf("day");
            // const periodEnd = currentDate.endOf("day");
            const periodStartStr = periodStart.toISOString();
            const periodEndStr = periodEnd.toISOString();

            let licenseeList, licenseeIdList;

            //----------------------------------------------------------------------------

            const unpaidPayouts = await LicenseePayout.find({ stripePayoutStatus: { $in: ["noaccount", "saved", "failed"] } }, {  })

            licenseeIdList = unpaidPayouts.map((payout) => {
                return payout._doc.licenseeId;
            });
            licenseeList = await Licensee.find({ _id: { $in: licenseeIdList } }, { stripeAccountId: 1 });

            await asyncForEach(unpaidPayouts, async(unpaidPayout) => {
                unpaidPayout = unpaidPayout._doc;

                let licenseeObj = licenseeList.find(licensee => {
                    return (licensee._doc._id.toString() === unpaidPayout.licenseeId.toString());
                });
                licenseeObj = licenseeObj._doc;
                const stripeAccountId = licenseeObj.stripeAccountId;
                // const stripeAccountId = "acct_1GVHg4BbS5dgzisH";

                if(stripeAccountId) {
                    if(["saved", "failed", "noaccount"].includes(unpaidPayout.stripePayoutStatus)) {
                        const transfer = await stripe.transfers.create({
                        // const transfer = await stripe.payouts.create({
                            // amount: unpaidPayout.totalAmount
                            // currency: 'aud',
                            amount: 2,
                            currency: 'inr',
                            destination: stripeAccountId,
                            metadata: {
                                startDate: unpaidPayout.startDate,
                                endDate: unpaidPayout.endDate,
                                payoutId: unpaidPayout.payoutId
                            }
                        });
                    }

                    if(["noaccount"].includes(unpaidPayout.stripePayoutStatus)) {
                        unpaidPayout.stripePayoutStatus = "saved";
                    }

                    await LicenseePayout.updateOne({ 
                        payoutId: unpaidPayout.payoutId
                    }, {
                        stripePayoutStatus: unpaidPayout.stripePayoutStatus,
                        stripeAccountId: stripeAccountId
                    });
                }
            });

            //----------------------------------------------------------------------------

            const rentalsQuery = { 
                "revisions.approvedOn": { $gt: periodStartStr, $lte: periodEndStr } 
            };

            const rentals = await Invoice.find(rentalsQuery, { licenseeId: 1, revisions: 1 });

            //------------------------------------------------------------------------------

            const licenseeRentals = {};
            const totalLicenseeRental = {};
            await asyncForEach(rentals, async(rental, rentalIndex) => {
                const licenseeId = rental.licenseeId.toString();
                if(!totalLicenseeRental[licenseeId]) {
                    totalLicenseeRental[licenseeId] = 0;
                    licenseeRentals[licenseeId] = [];
                }
                rental.revisions.forEach((revision) => {
                    if(moment(revision.approvedOn).isAfter(periodStart) && moment(revision.approvedOn).isBefore(periodEnd)) {
                        totalLicenseeRental[licenseeId] += (revision.totalCharges.total ? revision.totalCharges.total : 0);
                    }
                })
                    
                licenseeRentals[licenseeId].push(rental._id);
            });
            //------------------------------------------------------------------------------

            licenseeIdList = Object.keys(totalLicenseeRental);
            licenseeList = await Licensee.find({ _id: { $in: licenseeIdList } }, { stripeAccountId: 1 });
            await asyncForEach(licenseeList, async(licensee) => {
                const licenseeId = licensee._id.toString();
                // GET licensee Stripe Account ID
                // const stripeAccountId = licensee.stripeAccountId;
                const stripeAccountId = "acct_1GVHg4BbS5dgzisH";


                // Make Payment to Licensee on Stripe
                let licenseePayout;
                if(stripeAccountId) {
                    const payoutId = await Counter.getNextSequence("payoutId");

                    const transfer = await stripe.transfers.create({
                        // amount: totalLicenseeRental[licenseeId]
                        // currency: 'aud',
                        amount: 2,
                        currency: 'aud',
                        destination: stripeAccountId,
                        metadata: {
                            startDate: periodStart.toISOString(),
                            endDate: periodEnd.toISOString(),
                            payoutId: payoutId
                        }
                    });

                    licenseePayout = new LicenseePayout({ 
                        licenseeId: licensee._id,
                        totalAmount: totalLicenseeRental[licenseeId],
                        rentalIds: licenseeRentals[licenseeId],
                        stripeAccountId: stripeAccountId,
                        stripePayoutStatus: "saved",
                        startDate: periodStart.toISOString(),
                        endDate: periodEnd.toISOString(),
                        payoutId: payoutId
                    });
                    await licenseePayout.save();
                } else {
                    if(totalLicenseeRental[licenseeId] > 0) {
                        const payoutId = await Counter.getNextSequence("payoutId");

                        licenseePayout = new LicenseePayout({ 
                            licenseeId: licensee._id,
                            totalAmount: totalLicenseeRental[licenseeId],
                            rentalIds: licenseeRentals[licenseeId],
                            stripePayoutStatus: "noaccount",
                            startDate: periodStart.toISOString(),
                            endDate: periodEnd.toISOString(),
                            payoutId: payoutId
                        });
                        await licenseePayout.save();
                    } else {
                        console.log("Stripe Account ID of the Licensee is not saved");
                    }
                }
            });
        } catch(err) {
            console.log("startLicenseePayoutCron Error", err);
        }
    });
}

module.exports = startLicenseePayoutCron;