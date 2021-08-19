const moment = require('moment');

const cartItemsData = {
    "ONLY_RENTAL": {
        "description": "Invoice with many Rental Items", 
        "rentedItems": [ 
            {
                "itemType": "trailer"
            }
        ],
        "rentalPeriod": {
            "start": moment().add(4, "days").format("YYYY-MM-DD HH:mm"),
            "end": moment().add(5, "days").format("YYYY-MM-DD HH:mm")
        },
        "doChargeDLR": true,
        "hireType": "regular",
        "isPickUp": true,

        "pickUpLocation": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "coordinates": [-33.8132, 151.2172]
        },
        "dropOffLocation": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "coordinates": [-33.8132, 151.2172]
        }
    },
    "UPSELL_ITEM_RENTAL": {
        "description": "Invoice with many Rental Items", 
        "rentedItems": [ 
            {
                "itemType": "upsellitem"
            }
        ],

        "rentalPeriod": {
            "start": moment().add(4, "days").format("YYYY-MM-DD HH:mm"),
            "end": moment().add(5, "days").format("YYYY-MM-DD HH:mm")
        },

        "doChargeDLR": true,
        "hireType": "regular",
        "isPickUp": true,

        "pickUpLocation": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "coordinates": [-33.8132, 151.2172]
        },
        "dropOffLocation": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "coordinates": [-33.8132, 151.2172]
        }
    }
};

module.exports = cartItemsData;