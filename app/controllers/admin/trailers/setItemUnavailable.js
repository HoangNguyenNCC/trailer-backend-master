const { BadRequestError } = require('../../../helpers/errors');
const Trailers = require('../../../models/trailers');
const UpsellItems = require('../../../models/upsellItems');


const setUnavailable = async function(req,res,next){
    if(req.body.trailerId){
            const trailer = await Trailers.findById(req.body.trailerId)
            if(!trailer){
                throw new BadRequestError('Unauthorised Access')
            }
            trailer.availability = false
        }
        else if(req.body.upSellItemId){
            const upSellItem = await UpsellItems.findById(upSellItemId)
            if(!upSellItem){
                res.send({
                    message : 'No Upsell item with this ID registered'
                })
            }
            if(upSellItem.quantity == 0){
                upSellItem.availability = false
            }
        }
        else{
            res.send({
                message : 'Trailer or Upsell Item ID not found'
            })
        }
}

module.exports = setUnavailable ;
