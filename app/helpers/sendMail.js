const path = require('path');

const nodemailer = require('nodemailer');
const nodemailer_handlbars = require('nodemailer-express-handlebars');

const dotenv = require('dotenv');
dotenv.config();
const config = process.env;

const smtpTransport = nodemailer.createTransport({
    service: config.MAILER_SERVICE_PROVIDER,
    auth: {
        user: config.MAILER_EMAIL_ID,
        pass: config.MAILER_PASSWORD
    }
});

const handlebarsOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: `${__dirname}/mailtemplates`,
        layoutsDir: `${__dirname}/mailtemplates`,
        defaultLayout: '',
    },
    viewPath: `${__dirname}/mailtemplates`,
    extName: '.html'
};

smtpTransport.use('compile', nodemailer_handlbars(handlebarsOptions));


function sendMail(data) {
    // const newData = {
    //     from: config.MAILER_EMAIL_ID,
    //     to: data.to,
    //     subject: data.subject,
    //     text: "Hello world?",
    //     html: "<b>Hello world?</b>"
    // };
    data.from = config.MAILER_EMAIL_ID;
    smtpTransport.sendMail(data, function(err) {
        if(!err) {
            console.log("sendMail Success", data);
        } else {
            console.error("sendMail Error", err);
        }
    });
};

module.exports = sendMail;