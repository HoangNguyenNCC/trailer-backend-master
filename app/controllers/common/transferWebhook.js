const LicenseePayout = require('../../models/licenseePayouts');

function transferWebhook(req, res, next) {
    try {
        let event = JSON.parse(request.body);
        
        let transferData;
        
        switch (event.type) {
            case 'transfer.updated':
                transferData = event.data.object;
                saveLicenseePayoutStatus(transferData, "updated");
                break;
            case 'transfer.paid':
                transferData = event.data.object;
                saveLicenseePayoutStatus(transferData, "paid");
                break;
            case 'transfer.failed':
                transferData = event.data.object;
                saveLicenseePayoutStatus(transferData, "failed");
                break;
            case 'transfer.created':
                transferData = event.data.object;
                saveLicenseePayoutStatus(transferData, "created");
                break;
            case 'transfer.reversed':
                transferData = event.data.object;
                saveLicenseePayoutStatus(transferData, "reversed");
                break;
            default:
                // Unexpected event type
                return response.status(400).end();
        }
    
        // Return a response to acknowledge receipt of the event
        response.json({
            received: true
        });
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
}

async function saveLicenseePayoutStatus(transferData, eventType) {
    // Save to LicenseePayouts collection

    const updateObject = {
        stripePayoutStatus: eventType
    };

    await LicenseePayout.updateOne({ 
        payoutId: transferData.metadata.payoutId
    }, updateObject);
}

module.exports = transferWebhook;