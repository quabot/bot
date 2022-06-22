const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const PollSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    pollId: reqNum,
    channelId: reqString,
    msgId: reqString,
    options: reqNum,
    duration: reqString,
    interactionId: reqString,
    createdTime: reqString,
    endTimestamp: reqString,
    ended: reqBool,
});

module.exports = mongoose.model('Poll', PollSchema);