const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const PollConfigSchema = new mongoose.Schema({
    guildId: reqString,
    pollEnabled: reqBool,
    pollId: reqNum,
    pollLogEnabled: reqBool,
    pollLogChannelId: reqString,
    pollRole: { type: String, required: true, default: "none" },
});

module.exports = mongoose.model('Poll-Config', PollConfigSchema);