const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqArray = {
    type: Array,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}


const LogSchema = new mongoose.Schema({
    guildId: reqString,
    logChannelId: reqString,
    logEnabled: reqBool,
    enabledEvents: reqArray,
    disabledEvents: reqArray,
});

module.exports = mongoose.model('Log', LogSchema);