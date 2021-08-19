const cartItemsData = {
    "ONLY_RENTAL": {
        "transactionType": "rent",
        "rentedItem": "trailer",
        "rentedItemId": "5e4132b4603c2159b3e58acf",

        "bookedByUserId": "5e395d2f784ae3441c9486bc",

        "rentalPeriod": {
            "start": "2020-07-05T00:00:00.000+00:00",
            "end": "2020-07-07T00:00:00.000+00:00"
        },

        "trailerCharges": {
            "rentalCharges": {
                "pickUp": [{
                        "duration": 21600000,
                        "charges": 54
                    },
                    {
                        "duration": 32400000,
                        "charges": 69
                    },
                    {
                        "duration": 86400000,
                        "charges": 79
                    },
                    {
                        "duration": 129600000,
                        "charges": 119
                    },
                    {
                        "duration": 172800000,
                        "charges": 134
                    },
                    {
                        "duration": 259200000,
                        "charges": 157
                    },
                    {
                        "duration": 345600000,
                        "charges": 179
                    },
                    {
                        "duration": 432000000,
                        "charges": 197
                    },
                    {
                        "duration": 518400000,
                        "charges": 215
                    },
                    {
                        "duration": 604800000,
                        "charges": 233
                    },
                    {
                        "duration": 691200000,
                        "charges": 238
                    },
                    {
                        "duration": 777600000,
                        "charges": 243
                    },
                    {
                        "duration": 864000000,
                        "charges": 248
                    },
                    {
                        "duration": 950400000,
                        "charges": 253
                    },
                    {
                        "duration": 1036800000,
                        "charges": 258
                    },
                    {
                        "duration": 1123200000,
                        "charges": 263
                    },
                    {
                        "duration": 1209600000,
                        "charges": 268
                    },
                    {
                        "duration": 1,
                        "charges": 5
                    }
                ],
                "door2Door": [{
                        "duration": 21600000,
                        "charges": 65
                    },
                    {
                        "duration": 32400000,
                        "charges": 83
                    },
                    {
                        "duration": 86400000,
                        "charges": 95
                    },
                    {
                        "duration": 129600000,
                        "charges": 143
                    },
                    {
                        "duration": 172800000,
                        "charges": 161
                    },
                    {
                        "duration": 259200000,
                        "charges": 188
                    },
                    {
                        "duration": 345600000,
                        "charges": 215
                    },
                    {
                        "duration": 432000000,
                        "charges": 237
                    },
                    {
                        "duration": 518400000,
                        "charges": 258
                    },
                    {
                        "duration": 604800000,
                        "charges": 280
                    },
                    {
                        "duration": 691200000,
                        "charges": 286
                    },
                    {
                        "duration": 777600000,
                        "charges": 292
                    },
                    {
                        "duration": 864000000,
                        "charges": 298
                    },
                    {
                        "duration": 950400000,
                        "charges": 304
                    },
                    {
                        "duration": 1036800000,
                        "charges": 310
                    },
                    {
                        "duration": 1123200000,
                        "charges": 316
                    },
                    {
                        "duration": 1209600000,
                        "charges": 322
                    },
                    {
                        "duration": 1,
                        "charges": 6
                    }
                ]
            },
            "dlrCharges": 400
        },

        "totalCharges": {
            "rentalCharges": 134,
            "upsellCharges": 0,
            "dlrCharges": 20.10
        },

        "doChargeDLR": true,
        "hireType": "regular",
        "isPickUp": true,

        "pickUpLocation": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "location": {
                "type": "Point",
                "coordinates": [-33.8132, 151.2172]
            }
        },
        "dropOffLocation": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "location": {
                "type": "Point",
                "coordinates": [-33.8132, 151.2172]
            }
        },

        "isDriverLicenseVerified": true
    },
    "UPSELL_ITEM_RENTAL": {
        "transactionType": "rent",
        "rentedItem": "upsellitem",
        "rentedItemId": "5e4132b4603c2159b3e58acf",

        "bookedByUserId": "5e395d2f784ae3441c9486bc",

        "rentalPeriod": {
            "start": "2020-07-05T00:00:00.000+00:00",
            "end": "2020-07-07T00:00:00.000+00:00"
        },

        "doChargeDLR": true,
        "hireType": "regular",
        "isPickUp": true,

        "pickUpLocation": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "location": {
                "type": "Point",
                "coordinates": [-33.8132, 151.2172]
            }
        },
        "dropOffLocation": {
            "text": "NorthBridge, NSW, Australia",
            "pincode": "1560",
            "location": {
                "type": "Point",
                "coordinates": [-33.8132, 151.2172]
            }
        },

        "isDriverLicenseVerified": true
    }
};

module.exports = cartItemsData;