const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true
}

const reqBool = {
    type: Boolean,
    required: true
}

const GiveawaySchema = new mongoose.Schema({
    guildId: reqString,
    giveawayID: reqNum,
    winners: reqNum,
    prize: reqString,
    msgId: reqString,
    channelId: reqString,
    hostId: reqString,
    endTimestampRaw: reqString,
    ended: reqBool,
});

module.exports = mongoose.model('giveaway', GiveawaySchema);