const moment = require('moment');

const isValidExpiry = date => {
    return (
        typeof date === 'string' ? !date.includes('/') : true
    ) && formatExpiry(date).endOf("month").isAfter(moment())
}

const isValidDob = date => {
    return (
        typeof date === 'string' ? !date.includes('/') : true
    ) && formatDob(date).isBefore(moment().subtract(16, 'years'))
}

const formatDob = dob =>  moment(dob, "YYYY-MM-DD");

const formatExpiry = date => moment(date, "YYYY-MM");

module.exports = {
    isValidDob,
    isValidExpiry,
    formatDob,
    formatExpiry
}; 