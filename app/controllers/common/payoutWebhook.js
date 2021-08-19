const LicenseePayout = require('../../models/licenseePayouts');

function payoutWebhook(req, res, next) {
    try {
        let event = JSON.parse(request.body);
        
        let payoutData;
        
        switch (event.type) {
            case 'payout.updated':
                payoutData = event.data.object;
                saveLicenseePayoutStatus(payoutData, "updated");
                break;
            case 'payout.paid':
                payoutData = event.data.object;
                saveLicenseePayoutStatus(payoutData, "paid");
                break;
            case 'payout.failed':
                payoutData = event.data.object;
                saveLicenseePayoutStatus(payoutData, "failed");
                break;
            case 'payout.created':
                payoutData = event.data.object;
                saveLicenseePayoutStatus(payoutData, "created");
                break;
            case 'payout.canceled':
                payoutData = event.data.object;
                saveLicenseePayoutStatus(payoutData, "canceled");
                break;
            default:
                // Unexpected event type
                return response.status(400).end();
        }
    
        // Return a response to acknowledge receipt of the event
        response.json({received: true});
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
}

async function saveLicenseePayoutStatus(payoutData, eventType) {
    // Save to LicenseePayouts collection

    await LicenseePayout.updateOne({ 
        stripeAccountId: payoutData.destination
    }, 
    {
        stripePayoutStatus: eventType
    });
}

module.exports = payoutWebhook;