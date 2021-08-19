const moment = require('moment');

const trailerInsuranceData = {
    "VALID_TRAILER_INSURANCE": {
        "itemId": 1,
        "issueDate": moment().subtract(6, "months").format("YYYY-MM-DD"),
        "expiryDate": moment().add(6, "months").format("YYYY-MM-DD"),
    }
};

module.exports = trailerInsuranceData;