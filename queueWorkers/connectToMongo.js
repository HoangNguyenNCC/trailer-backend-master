const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let isConnected;

module.exports = () => {
    if (!isConnected) {
        console.log('Creating a new mongodb connection');
        return mongoose.connect(process.env.MONGODB_CONNECTION_URI, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useCreateIndex: false,
        }).then(db => {
            isConnected = db.connections[0].readyState;
        });
    }

    console.log('Reusing existing mongo connection');
    return Promise.resolve();
}