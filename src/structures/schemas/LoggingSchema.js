const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqArray = {
    type: Array,
    required: true,
    default: [],
};

const reqBool = {
    type: Boolean,
    required: true,
};

const LogSchema = new mongoose.Schema({
    guildId: reqString,
    logChannelId: reqString,
    logEnabled: reqBool,
    logExcludedChannels: reqArray,
    enabledEvents: reqArray,
    disabledEvents: reqArray,
});

module.exports = mongoose.model('Log', LogSchema);
