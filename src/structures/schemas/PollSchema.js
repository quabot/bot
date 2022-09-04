const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const reqArray = {
    type: Array,
    required: true,
}

const PollSchema = new mongoose.Schema({
    guildId: reqString,
    pollId: reqNum,
    channelId: reqString,
    msgId: reqString,
    options: reqNum,
    duration: reqString,
    interactionId: reqString,
    createdTime: reqString,
    endTimestamp: reqString,
    optionsArray: reqArray
});

module.exports = mongoose.model('Poll', PollSchema);