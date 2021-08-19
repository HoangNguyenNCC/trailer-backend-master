const getFiles = require('./getFiles');

const startLicenseePayoutCron = require('./makeLicenseePayouts');
const payoutWebhook = require('./payoutWebhook');

function commonRoutes(app) {

    app.get('/file/:source/:id/:index?', getFiles);

    app.post('/stripe/webhook/payout', payoutWebhook);

    startLicenseePayoutCron();
}

module.exports = commonRoutes;