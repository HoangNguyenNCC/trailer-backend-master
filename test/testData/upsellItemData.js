const mongoose = require('mongoose');

const upsellItemData = {
    VALID_UPSELL_ITEM: {
        "name": "Trailers 2000 7 x 4' Universal Tonneau Cover",
        "type": "7-4-cage-cover",

        "description": "Universal tonneau covers are tough and made to suit most standard size 6 x 4 box trailers.This easy to fit cover is ideal for protecting against dust and water, the kit contains the cover, bow and buttons for securing the cover to the trailer",

        "availability": true,

        "trailerId": "5e41314d603c2159b3e58aab"
    },
    "aluminium_folding_ramps": {
        "trailerId": "5e41314d603c2159b3e58aab",

        "name": "Aluminium Folding Ramps",

        "type": "aluminium-ramps",

        "description": "These aluminium folding ramps are lightweight and hold a whopping 600kg per set. Great for loading mowers, bikes and  small machinery.",

        "availability": true
    },
    "vinyl_cage_covers": {

        "trailerId": "5e41314d603c2159b3e58aab",

        "name": "Vinyl Cage Covers - 7 x 4",

        "type": "7-4-cage-cover",

        "description": "This tough vinyl cage cover tailored specifically to fit standard the trailer cage . This cover is ideal for protecting against dust and water and comes complete with bow and buttons for securing the cover to the trailer.",

        "availability": true
    }
};

module.exports = upsellItemData;