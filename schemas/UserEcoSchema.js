const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const falseString = {
    type: String,
    required: false,
}
const reqNumber = {
    type: Number,
    required: true,
}

const UserEcoSchema = new mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    guildName: reqString,
    outWallet: reqNumber,
    walletSize: reqNumber,
    inWallet: reqNumber,
    lastDaily: falseString,
    lastWeekly: falseString,
    lastMonthly: falseString,
    lastUsed: reqString,
});

module.exports = mongoose.model('UserEco', UserEcoSchema);