const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');

dotenv.config();
const config = process.env;

const Counter = require('./counters');

let NotificationSchema = new Schema({
    notificationRef: { type: String, trim: true, unique: true },

    notificationType: {
        type: String, trim: true,
        required: [true, "Notification Type is a required field"]
    },
    message: {
        type: String, trim: true,
        required: [true, "Notification Message is a required field"]
    },
    title: { type: String, trim: true },
    rentalId: { type: Schema.Types.ObjectId },
    trailerName: { type: String, trim: true },
    image: { type: String, trim: true },
    licensee: { type: String, trim: true },
    status: { type: String, trim: true  },
    customerId: { type: String, trim: true },
    licenseeId: { type: String, trim: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
NotificationSchema.pre('save', async function(next) {
    const notification = this;

    const now = new Date();
    if (!notification.createdAt) {
        notification.createdAt = now;
    }
    notification.updatedAt = now;

    if(!notification.notificationRef) {
        const notificationRef = await Counter.getNextSequence("notificationRef");
        notification.notificationRef = `NOTIFICATION${(notificationRef.toString()).padStart(10, '0')}`;
    }

    next();
});

NotificationSchema.pre('updateOne', { document: true }, async function(query, next) {
    let notification = this;
    notification = notification._update;

    const now = new Date();
    if(!notification.createdAt) {
        notification.createdAt = now;
    }
    notification.updatedAt = now;

    next();
});

module.exports = mongoose.model('notification', NotificationSchema);