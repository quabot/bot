const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}

const BotSchema = new mongoose.Schema({
    verifToken: reqNumber,
    pollId: reqNumber,
    suggestId: reqNumber,
});

module.exports = mongoose.model('Bot', BotSchema);