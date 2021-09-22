const mongoose = require('mongoose');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family:4
        };

        mongoose.connect('mongodb+srv://admin:AbyUoKpaaWrjK@cluster.n4eqp.mongodb.net/Database?retryWrites=true&w=majority', dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Connected to the Quabot database.');
        });

        mongoose.connection.on('err', err => {
            console.error(`Failed to connect to the Quabot database.\n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Disconnected from the Quabot database.');
        });
    }
}