const mongoose = require('mongoose');

const UserEcoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    outWallet: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    walletSize: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    inWallet: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    lastDaily: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    lastWeekly: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    lastMonthly: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    lastUsed: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
});

module.exports = mongoose.model('UserEco', UserEcoSchema);