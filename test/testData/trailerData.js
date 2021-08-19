const mongoose = require('mongoose');

const trailer_data = {
    "VALID_TRAILER": {
        "adminRentalItemId": "5ec92597192b4c45f69e01b6",
        "name": "2020 C&B DMP610-6TA 26\"",
        "vin": "123456789",
        "type": "dump",
        "description": "2 5/16\" ADJUSTABLE COUPLER, 8000# JACK, LOOSE RAMPS, SCISSOR HOIST",
        "size": "Length: 10' Width: 6'",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "2 5/16\" ADJUSTABLE COUPLER",
            "8000# JACK",
            "LOOSE RAMPS",
            "SCISSOR HOIST",
            "26\" SIDES",
            "STAKE POCKETS",
            "LED LIGHTS",
            "HD FENDERS"
        ],

        "availability": true
    },

    "MORE_VALID": {
        "name": "2020 C&B DMP610-6TA 26\"",
        "vin": "123456789",
        "type": "dump",
        "description": "2 5/16\" ADJUSTABLE COUPLER, 8000# JACK, LOOSE RAMPS, SCISSOR HOIST",
        "size": "Length: 10' Width: 6'",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "2 5/16\" ADJUSTABLE COUPLER",
            "8000# JACK",
            "LOOSE RAMPS",
            "SCISSOR HOIST",
            "26\" SIDES",
            "STAKE POCKETS",
            "LED LIGHTS",
            "HD FENDERS"
        ],

        "availability": true
    },

    "TuffMate2000": {
        "name": "TuffMate2000",
        "vin": "123456789",
        "type": "cage-trailer",
        "description": "TuffMate2000 which is a polyethylene trailer available in 6 x 4 and 7 x 4, these would be classified as a small cage trailer. I have attached a high res photo of the trailer. TuffMate2000 is a revolutionary polyethylene ultra tough trailer and is designed and manufactured in Australia. Trailers 2000 engineers have adopted cutting edge technology to produce Australia’s Tuffest Trailer.  Collaborating with leaders in industrial design, physics and engineering Trailers 2000 has developed new technology and innovation resulting in the next generation of box trailers. This once in a lifetime multi-purpose trailer makes all other trailers look obsolete and won’t rust, dent or fade and is packed to the brim with outstanding features",
        "size": "6' x 4' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7' x 4' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,
        "isFeatured": true,

        "features": [
            "Made in Australia.",
            "Patented Design.",
            "High Impact Resistant LLDPE (polyethylene) body.",
            "Impervious to almost any chemical.",
            "Seamless Dual Skin Technology gives the body superior Tuffness.",
            "Chip and scratch resistant colour.",
            "Quick and easy to clean.",
            "Lighter and stronger."
        ],

        "availability": true
    },

    "Tandem_Axle_Box_Trailer": {
        "name": "Tandem Axle Box Trailer",
        "vin": "123456789",
        "type": "cage-trailer",
        "description": "tandem axle box trailer, this will be fitted with a cage, this will be available in 10 x 6. Attached is a photo of the trailer without the cage. The range of heavy duty hot dip galvanised trailers are made tough for Australian conditions. Whether you are carrying a load up the road or across the country you want to rely on the trailer you own to do the job. Our trailers are built to last. Australian made for Australian conditions, and come with unbeatable 2 year Warranty and FREE 2 years Roadside Assist",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "hot dip galvanised",
            "checker plate floor",
            "full chassis",
            "longer drawbar",
            "jockey wheel clamp",
            "spare wheel bracket",
            "new wheels and tyres",
            "LED lights",
            "magnetic trailer plug"
        ],

        "availability": true,

        "size": "6' x 4' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7' x 4' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides."
    },

    "Box_Trailer": {
        "name": "Box Trailer",
        "vin": "123456789",
        "type": "cage-trailer",
        "description": "box trailer, this will be fitted with a cage, this will be available in medium size cage trailer. Attached is a photo of the trailer without the cage. The range of heavy duty hot dip galvanised trailers are made tough for Australian conditions. Whether you are carrying a load up the road or across the country you want to rely on the trailer you own to do the job.Our trailers are built to last. Australian made for Australian conditions, and come with unbeatable 2 year Warranty and FREE 2 years Roadside Assist.",
        "size": "6' x 4' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7' x 4' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "Made in Australia.",
            "hot dip galvanised",
            "checker plate floor",
            "full chassis",
            "longer drawbar",
            "jockey wheel clamp",
            "spare wheel bracket",
            "new wheels and tyres",
            "LED lights",
            "magnetic trailer plug"
        ],

        "availability": true
    },

    "2000kg_Car_Trailer": {
        "name": "2000kg Car Trailer",
        "vin": "123456789",
        "type": "car-trailer",
        "description": "Moving a car has never been easier if you have your own car trailer that is built for the job. These painted car trailers are designed to handle tough Australian conditions and are ideal for work on the farm or around the home. The heavy duty chassis and drawbar are made from galvanized steel profiles and unlike other profiles our profiles are galvanised inside and out where it really counts. This trailer has 230mm high sides, full chassis with cross members every 300mm, heavy duty tie points and 2000kg Aggregate Trailer Mass (ATM). Or if you need even more capacity this have a look at our 3500kg trailer. This trailer is also suitable for carrying machinery and equipment, lawn mowers and tanks.",
        "size": "6' x 4' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7' x 4' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "Made in Australia."
        ],

        "availability": true
    },

    "3500kg_Car_Trailer": {
        "name": "3500kg Car Trailer",
        "vin": "123456789",
        "type": "car-trailer",
        "description": "If your moving a vehicle that weighs mor then 1200kg then this 3500kg GVM trailer (2400kg load) is the trailer for you. These painted car trailers are designed to handle tough Australian conditions and are ideal for work on the farm or around the home. The heavy duty chassis and drawbar are made from galvanized steel profiles and unlike other profiles our profiles are galvanised inside and out where it really counts. This trailer has 230mm high sides, full chassis with cross members every 300mm, heavy duty tie points and 2000kg Aggregate Trailer Mass (ATM). This trailer is suitable for carrying larger vehicles, 4WD’s, machinery and equipment, lawn mowers and tanks.",
        "size": "6' x 4' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7' x 4' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "Made in Australia."
        ],

        "availability": true
    },

    "3500kg_Flat_Deck_Trailer": {
        "name": "3500kg Flat Deck Trailer",
        "vin": "123456789",
        "type": "flat-deck-trailer",
        "description": "This flat deck trailer is as good as they get. Packed with outstanding features including: low maintenance galvanised steel construction, full chassis, checkerplate floor, longer drawbar, jockey wheel, spare wheel. Designed to handle tough Australian conditions, this trailer is suitable for carrying pallets, machinery and equipment, lawn mowers, tanks and much more. Other features include heavy duty tie rails under sides. Tis trailer has 4 wheel electric brakes and has a capacity of 3500kg GVM.",
        "size": "6' x 4' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7' x 4' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "Made in Australia."
        ],

        "availability": true
    },

    "Medium_Enclosed_Trailer": {
        "name": "Medium Enclosed Trailer",
        "vin": "123456789",
        "type": "enclosed-trailer",
        "description": "These aluminium bodied luggage trailers have an incredible high gloss high quality finish as good as any motor car and the polished checker plate around the base is a real feature that adds to the outstanding finish of this trailer.  The strong and durable trailer is standard with a composite aluminium body, galvanised steel chassis and frame and LED lights.  The lift door is sealed and is fitted with heavy duty stainless steel hinges, gas struts and flush mount locks. Our clever design makes the trailers’ chassis superior; rust free, stronger and built to last. These Australian made Luggage trailers are built for the job and are 8 x 5 x 6 (2400 x 1500 x 1800).",
        "size": "8 x 5 x 6 (2400 x 1500 x 1800)",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "Made in Australia."
        ],

        "availability": true
    },

    "Large_Enclosed_Trailer": {
        "name": "Large Enclosed Trailer",
        "vin": "123456789",
        "type": "enclosed-trailer",
        "description": "These aluminium bodied luggage trailers have an incredible high gloss high quality finish as good as any motor car and the polished checker plate around the base is a real feature that adds to the outstanding finish of this trailer.  The strong and durable trailer is standard with a composite aluminium body, galvanised steel chassis and frame and LED lights.  The lift door is sealed and is fitted with heavy duty stainless steel hinges, gas struts and flush mount locks. Our clever design makes the trailers’ chassis superior; rust free, stronger and built to last. These Australian made large enclosed trailers are built for the job and are 10 x 6 x 66’6” (3000 x 1800 x 2000)",
        "size": "10 x 6 x 66’6” (3000 x 1800 x 2000)",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "Made in Australia."
        ],

        "availability": true
    },

    "Hydraulic_Tipping_Trailer": {
        "name": "Hydraulic Tipping Trailer",
        "vin": "123456789",
        "type": "hydraulic-tipping-trailer",
        "description": "When you need a trailer made especially for tipping extra heavy loads the 3500kg hydraulic tipping trailer is made for the job. The galvanised tandem trailers in our range are 100% Australian made and built to handle the big stuff.",
        "size": "6' x 4' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7' x 4' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "Capacity of 3500kg GVM (2400kg Load)",
            "a low maintenance galvanised steel construction",
            "300mm high sides",
            "extra heavy duty full chassis' with cross members approximately every 300mm",
            "4 stage - 10t hydraulic ram",
            "fully self contained 12v power plant and hydraulic fluid reservoir with pendant control housed in an aluminium toolbox",
            "safety isolation switch",
            "Extended drawbar",
            "minimum 45 degree tilt angle",
            "heavy duty latches to lock the body",
            "heavy duty tie rails all round",
            "full rear cross member",
            "removable tailgate",
            "New light Truck Tyres",
            "Swivel Jockey Wheel",
            "Deck size is 10 x 6 (3000mm x 1800mm)",
            "Galvanised steel cage"
        ],

        "availability": true
    },

    "Sample": {
        "name": "TuffMate2000",
        "vin": "123456789",
        "type": "dump",
        "description": "",
        "size": "6' x 4' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7' x 4' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.",
        "capacity": "6980 lbs",
        "tare": "2920 lbs",
        "age": 4,

        "features": [
            "Made in Australia.",
        ],

        "availability": true
    }

};

module.exports = trailer_data;