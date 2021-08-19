const Finance = require('../../../models/financials');
const Invoice  = require('../../../models/invoices');
const User = require('../../../models/users');
const Licensee = require('../../../models/licensees');
const Trailer = require('../../../models/trailers');
const Upsell = require('../../../models/upsellItems');

const constants = require('../../../helpers/constants');
const { getSearchCondition } = require('../../../helpers/getSearchCondition');
const mongoose = require('mongoose');
const asyncforEach = require('../../../helpers/asyncForEach');
const asyncForEach = require('../../../helpers/asyncForEach');
const { BadRequestError } = require('../../../helpers/errors');

const getFinancials = async function(req,res){
    const pageCount = (req.query && req.query.count) ? parseInt(req.query.count) : constants.pageCount;
        const pageSkip = (req.query && req.query.skip) ? parseInt(req.query.skip) : constants.pageSkip;
        let searchCondition = {};

        if(req.query && Object.keys(req.query).length > 0){
            const search = [{condition:"bookingId", search:"bookingId"},{condition:"customerId", search:"customerId"},{condition:"licenseeEmail", search:"lemail"},{condition:"customerEmail", search:"cemail"},{condition:"licenseeId", search:"licenseeId"}]
            const filters = [{filter:"isLicenseePaid", search:"isLicenseePaid"}] 
            searchCondition = await getSearchCondition(req.query,search,filters)
            if(searchCondition.lemail){
                let licensee =  await Licensee.findOne({email:searchCondition.lemail},{_id:1})
                if(!licensee){
                    throw new BadRequestError('No User Registered with this Email')
                }
                searchCondition['licenseeId'] = mongoose.Types.ObjectId(licensee._id)
                delete searchCondition.lemail
            }
            if(searchCondition.cemail){
                let user  = await User.findOne({email:searchCondition.cemail},{_id:1})
                if(!user){
                    throw new BadRequestError('No User Registered with this Email')
                }
                searchCondition['customerId'] = mongoose.Types.ObjectId(user._id)
                delete searchCondition.cemail
            }
        }

        let finances = await Finance.find(searchCondition).skip(pageSkip).limit(pageCount);
        let financeStats = []

        await asyncforEach(finances,async (finance) =>{
            finance = finance._doc
            finance.rentalObject = await Invoice.findOne({_id:mongoose.Types.ObjectId(finance.rentalId)});
            finance.customerName = await User.findOne({_id:mongoose.Types.ObjectId(finance.customerId)},{name:1})
            finance.licenseeName = await Licensee.findOne({_id:mongoose.Types.ObjectId(finance.licenseeId)},{name:1})
            finance.trailerNames=[]
            finance.upsellNames = []
            await asyncForEach(finance.rentalObject.rentedItems , async(object)=>{
                if(object.itemType == "trailer"){
                    finance.trailerNames.push(await Trailer.findById({_id:mongoose.Types.ObjectId(object.itemId)},{name:1}))
                }else{
                    finance.upsellNames.push(await Upsell.findById({_id:mongoose.Types.ObjectId(object.itemId)},{name:1}))
                }
            })
            financeStats.push({...finance})
        })

        res.status(200).send({
            success : true,
            message : 'Fetched All Finances',
            finances : financeStats
        })
}

module.exports = getFinancials ;