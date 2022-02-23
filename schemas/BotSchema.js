const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}
const falseNumber = {
    type: Number,
    required: false,
}

const BotSchema = new mongoose.Schema({
    verifToken: reqNumber,
    pollId: reqNumber,
    suggestId: reqNumber,
    botUsers: falseNumber,
    botGuilds: falseNumber,
    botChannels: falseNumber,
});

module.exports = mongoose.model('Bot', BotSchema);