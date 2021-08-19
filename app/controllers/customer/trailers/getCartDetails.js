const mongoose = require('mongoose');

const Cart = require('../../../models/carts');
const CartItem = require('../../../models/cartItems');

/**
 * 
 * @api {GET} /cart Get Shopping Cart Details
 * @apiName CA - Get Shopping Cart Details
 * @apiGroup Customer App - Trailer Rental Old
 * 
 * 
 * @apiParam {String} cartId If of the Cart for which the Cart Details have to be fetched
 * 
 * 
 * @apiDescription API Endpoint GET /cart data
 * 
 * 
 * @apiSuccess {Boolean} success Success Status
 * @apiSuccess {String} message Success Message 
 * @apiSuccess {Object} cartObj Cart Object
 * @apiSuccess {Array} cartItemsList Cart Items List
 * @apiSuccess {Object} charges Total Charges of the Shopping Cart
 * 
 * 
 * @apiSuccessExample {String} - Success-Response:
 * HTTP/1.1 200
    {
        success: true,
        message: "Successfully fetched Shopping Cart data",
        cartObj: {},
        cartItemsList: [],
        charges: {}
    }
 * 
 * Sample API Call : http://localhost:5000/cart?cartId=<Cart ID>
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400
    {
        success: false,
        message: "Error occurred while fetching Shopping Cart data",
        errorsList: []
    }
 * 
 * 
 */
async function getCartDetails(req, res, next) {

    try {
        if (!req.userId) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }

        const cartId = mongoose.Types.ObjectId(req.query.cartId);

        let cart = await Cart.findOne({ _id: cartId });
        cart = cart._doc;

        let cartItems = await CartItem.find({ cartId: cartId });
        let totalRentalCharges = {
            total: 0,
            rentalCharges: 0,
            dlrCharges: 0,
            t2yCommission: 0,
            discount: 0,
            lateFees: 0,
            cancellationCharges: 0,
            taxes: 0
        };

        cartItems.forEach((cartItem, cartItemIndex) => {
            cartItem = cartItem._doc;

            const cartItemIn = cart.cartItem.find((cartItemInCart, index) => {
                return (cartItemInCart.itemId.toString() === cartItem._id.toString());
            });
            if(cartItemIn && !cartItemIn.isRemoved) {
                totalRentalCharges.total += cartItem.total;
                totalRentalCharges.rentalCharges += cartItem.rentalCharges;
                totalRentalCharges.dlrCharges += cartItem.dlrCharges;
                totalRentalCharges.t2yCommission += cartItem.t2yCommission;
                totalRentalCharges.discount += cartItem.discount;
                totalRentalCharges.lateFees += cartItem.lateFees;
                totalRentalCharges.cancellationCharges += cartItem.cancellationCharges;
                totalRentalCharges.taxes += cartItem.taxes;
            }
            cartItems[cartItemIndex] = cartItem;
        });

        return res.status(200).send({
            success: true,
            message: "Successfully fetched Cart Details data",
            cartObj: cart,
            cartItemsList: cartItems,
            charges: totalRentalCharges
        });
    } catch (err) {
        console.error("getCartDetails Error", err);

        let errorCode = 500;
        let errors = [];
        let errorMessage = "Error occurred while fetching Cart Details data";

        if (err && err.name && ["MongoError", "ValidationError"].includes(err.name) && err.message) {
            errorCode = 400;
            if(err.code && err.code === 11000 && err.keyValue) {
                const keys = Object.keys(err.keyValue);
                const values = Object.values(err.keyValue);
                errorMessage = `Duplicate Key Error on { ${keys[0]}: ${values[0]} }`;
                errors.push(errorMessage);
            } else {
                errorMessage = err.message;
                errors.push(errorMessage);
            }
        } else if (err && err.message) {
            errorCode = err.message.startsWith("VALIDATION-") ? 400 : 500;
            const errorComp = err.message.split("VALIDATION-");
            errorMessage = errorComp.length > 1 ? errorComp[1] : errorComp[0];
            errors.push(errorMessage);
        } else if (err && err.errors) {
            errorCode = 400;
            const fieldKeys = Object.keys(err.errors);
            fieldKeys.forEach((fieldKey) => {
                if (fieldKey.split(".").length === 1) {
                    errors.push(err.errors[fieldKey].message);
                    if(err.errors[fieldKey].message) {
                        errorMessage = err.errors[fieldKey].message;
                    }
                }
            });
        } else {
            if(err) {
                errorMessage = err;
            }
            errors.push(err);
        }

        return res.status(errorCode).send({
            success: false,
            message: errorMessage,
            errorsList: errors
        });
    }
}

module.exports = getCartDetails;