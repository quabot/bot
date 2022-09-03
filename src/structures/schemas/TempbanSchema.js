const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const TempbanSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    unbanTime: reqString,
    banId: reqNum,
    channelId: reqString,
    banDuration: reqString,
});

module.exports = mongoose.model('Tempban', TempbanSchema);