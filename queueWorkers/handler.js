'use strict';
const AWS = require('aws-sdk');
const moment = require('moment');
const fs = require('fs');
const nodeMailer = require('nodemailer');

const connectToMongo = require('./connectToMongo');
const generateInvoice = require('./generateInvoice');

const Invoice = require('./models/invoices');
const User = require('./models/users');
const Trailer = require('./models/trailers');
const UpsellItem = require('./models/upsellItems');

const S3 = new AWS.S3();
const SQS = new AWS.SQS();

function validateEmailPayload(payload) {
  return payload.sendTo && payload.emailBody && payload.subject;
}

const isValidAttachments = attachments => {
  const URL_REGEX = 
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  
  let isValid = Array.isArray(attachments) && attachments.length;

  for (let attachment of attachments) {
    if (!attachment.fileName || !attachment.path || !attachment.path.match(URL_REGEX)) isValid = false;
  }

  return isValid;
}

/**
 * 
 * payload structure
   {
     sendTo: "abc@gmail.com",
     subject: "Test Subject",
     emailBody: "<h1>EmailBody </h1>"   // SUPPORTS BOTH HTML AND TEXT BODY
     attachments: [
       {
          fileName: "attachment.pdf",
          path: "https://filepath.com/attachment.pdf" // HAS TO BE A VALID URL
       }
     ]
   }
 */
module.exports.emailWorker = async event => {

  const mailerTransport = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    pool: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  for (const { body } of event.Records) {
    const payload = JSON.parse(body);
    const isValidPayload = validateEmailPayload(payload);

    if (!isValidPayload) {
      console.log(`Invalid Payload : ${body}`);
      return {statusCode: 400, error: 'Invalid Payload'};
    }

    const params = {
      from: process.env.EMAIL_FROM,
      to: payload.sendTo,
      subject: payload.subject,
      html: payload.emailBody
    }

    if (payload.attachments) {
      if (isValidAttachments(payload.attachments)) {
        params.attachments = payload.attachments;
      } else {
        console.error(`INVALID ATTACHMENTS IN PAYLOAD ${JSON.stringify(payload)}`);
      }
    }

    try {
      const response = await mailerTransport.sendMail(params);
      console.log(`Email sent successfully ${JSON.stringify(response)}`);
      return {statusCode: 200}
    } catch (e) {
      console.log(`Error sending email`);
      console.error(e);
      console.log(`Email body: ${body}`);
      return {statusCode: 400}
    }

  }

};

module.exports.invoiceWorker = async event => {

  try {
    await connectToMongo(); 

    for (const { body } of event.Records ) {
      const payload = JSON.parse(body);
  
      const { invoiceId } = payload;
     
      const invoicePayload = await extractInvoiceGenerationParams(invoiceId);
      console.log(`Invoice Payload : ${JSON.stringify(invoicePayload)}`);
    
      const invoicePdf = generateInvoice(invoicePayload);

      const invoice = await Invoice.findById(invoiceId);
      const user = await User.findById(invoice.bookedByUserId, {email: 1});
      
      const fileName = `${user._id}-${Date.now()}.pdf`;
      invoicePdf.pipe(fs.createWriteStream(`/tmp/${fileName}`));

      const fileUploadParams = {
        Bucket: process.env.INVOICE_S3_BUKCET_NAME,
        Key: fileName,
        Body: fs.createReadStream(`/tmp/${fileName}`)
      }

      const savedFile = await S3.upload(fileUploadParams).promise();
      const savedInvoiceKey = savedFile.Key;

      console.log('invoice generated and saved successfully');
      console.log(JSON.stringify(savedFile));

      if (invoice && invoice.revisions && invoice.revisions.length) {
        const latestRevisionIndex = invoice.revisions.length - 1;
        const latestRevision = invoice.revisions[latestRevisionIndex];
        latestRevision.invoiceKey = savedInvoiceKey;
        invoice.revisions[latestRevisionIndex] = latestRevision;

        invoice.invoiceKey = savedInvoiceKey;

        const updatedInvoice = await invoice.save();
        console.log(updatedInvoice.toJSON());
      }

      const messageParams = {
        sendTo: user.email,
        subject: 'T2Y Invoice',
        emailBody: `Here's your invoice for the latest payment you made..`,
        attachments: [
          {
            fileName: 'invoice.pdf',
            path: S3.getSignedUrl('getObject', { Bucket: process.env.INVOICE_S3_BUKCET_NAME, Key: savedInvoiceKey })
          }
        ]
      };

      const sqsParams = {
        MessageBody: JSON.stringify(messageParams),
        QueueUrl: process.env.EMAIL_QUEUE_URL
      }

      const response = await SQS.sendMessage(sqsParams).promise();
      console.log(`EMAIL SENT ${JSON.stringify(response)}`);

      return { statusCode: 200 };
      
    }
  } catch (e) {
    console.error('INVOICE GENERATION FAILED');
    console.error(e);
    return {statusCode: 400};
  }

}

const extractInvoiceGenerationParams = async invoiceId => {
  const invoice = await Invoice.findById(invoiceId, {bookedByUserId: 1, invoiceNumber: 1, rentalPeriod: 1, rentedItems: 1, charges: 1}).lean();
  
  if (!invoice) {
    console.error(`Invoice not found for Id ${invoiceId}`);
    return { statusCode: 400 };
  }

  const user = await User.findById(invoice.bookedByUserId, {name: 1, address: 1, email: 1}).lean();

  if (!user) {
    console.error(`User not found for userId : ${invoice.bookedByUserId}, invoiceId: ${invoice._id}`);
    return { statusCode: 400 };
  }

  const invoicePayload = {
    shipping: {
      name: user.name,
      address: user.address.text,
      // city: user.address.city,
      // state: user.address.state,
      // country: user.address.country,
      postal_code: user.address.pincode
    },
    startDate: moment(invoice.rentalPeriod.start).format('YYYY-MM-DD'),
    endDate: moment(invoice.rentalPeriod.end).format('YYYY-MM-DD'),
    invoice_nr: invoice.invoiceNumber,
    amount: invoice.charges.totalPayableAmount,
    items: []
  };

  invoice.charges.upsellCharges = invoice.charges.upsellCharges.reduce((result, itemCharge) => ({
     ...result,
      [itemCharge.id]: itemCharge
    }), {});  

  for (let rentedItem of invoice.rentedItems) {

    if (rentedItem.itemType === 'trailer') {
      const item = await Trailer.findById(rentedItem.itemId, {name: 1}).lean();
      invoicePayload.items.push({
        item: item.name,
        type: 'trailer',
        quantity: 1,
        amount: invoice.charges.trailerCharges.total
      });
    } else if (rentedItem.itemType === 'upsellitem') {
      const item = await UpsellItem.findById(rentedItem.itemId, {name: 1}).lean();
      invoicePayload.items.push({
        item: item.name,
        type: 'upsellitem',
        quantity: rentedItem.units,
        amount: invoice.charges.upsellCharges[item._id].charges.total
      })
    }

  }
  return invoicePayload;
}