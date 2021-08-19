const dotenv = require('dotenv');

dotenv.config();
const config = process.env;


function getFilePath(source, id, index) {
    return `${config.HOST}/file${source ? '/'+source : ''}${id ? '/'+id : ''}${index ? '/'+index : ''}`
}

module.exports = getFilePath;