var FCM = require("fcm-node");
const dotenv = require("dotenv");
dotenv.config();
var serverKey = process.env.FCM_KEY;
var fcm = new FCM(serverKey);


const licenseeNotification = async function (title, body, type, id, token) {
  try {
    const message = {
      to: token,
      notification: {
        title,
        body,
      },
      data: {
        type,
        rentalId: id,
      },
    };
    await sendNotification(message);
  } catch (err) {
    console.log(err);
  }
};

const customerNotification = async function (title, body, type, id, token) {
  try {
    const message = {
      to: token,
      notification: {
        title,
        body,
      },
      data: {
        type,
        rentalId: id,
      },
    };
    await sendNotification(message);
  } catch (err) {
    console.log(err);
  }
};

const sendNotification = async function (message) {
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

module.exports = {
  licenseeNotification,
  customerNotification,
};
