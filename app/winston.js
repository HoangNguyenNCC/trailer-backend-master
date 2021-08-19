const winston = require('winston');
const expressWinston = require('express-winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
});

const reqLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    dynamicMeta: function(req, res) {
        return {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            data: res.outputData,
            route: req.path
        }
    },
    headerBlacklist: ['cookie'],
    requestWhitelist: ['body'],
    responseWhitelist: ['body'],
    ignoreRoute: (req, res) => {
        return req.path.includes('/file');
    }
});

const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
});

module.exports = {
    reqLogger,
    errorLogger,
    logger
};