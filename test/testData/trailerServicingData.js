const moment = require('moment');

const trailerServicingData = {
    "VALID_TRAILER_SERVICING": {
        "itemId": 1,
        "name": "Tyres-Check Tread Wear",
        "serviceDate": moment().subtract(6, "months").format("YYYY-MM-DD"),
        "nextDueDate": moment().add(6, "months").format("YYYY-MM-DD")
    }
};

module.exports = trailerServicingData;