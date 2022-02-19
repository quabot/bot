const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const falseString = {
    type: String,
    required: false,
}
const falseNumber = {
    type: Number,
    required: false,
}
const reqNumber = {
    type: Number,
    required: true,
}
const falseArray = {
    type: Array,
    required: true,
}

const UserEcoSchema = new mongoose.Schema({
    userId: reqString,
    outWallet: reqNumber,
    walletSize: reqNumber,
    inWallet: reqNumber,
    lastDaily: falseString,
    lastLottery: falseString,
    lastUsed: reqString,
    lastMeme: falseString,
    lastCrime: falseString,
    lastBeg: falseString,
    lastRobbed: falseString,
    lastRobAny: falseString,
    commandsUsed: falseNumber,
    shop: falseArray,
});

module.exports = mongoose.model('UserEco', UserEcoSchema);