const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true
}

const ApplicationConfigSchema = new mongoose.Schema({
    guildId: reqString,
    applicationEnabled: reqBool,
    applicationLogEnabled: reqBool,
    applicationLogChannelId: reqString,
});

module.exports = mongoose.model('application-config', ApplicationConfigSchema);