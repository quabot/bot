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

const ApplicationConfigSchema = new mongoose.Schema({
    guildId: reqString,
    applicationEnabled: reqBool,
    applicationReapply: reqBool,
    applicationLogChannelId: reqString,
    applicationAdminRole: reqString,
});

module.exports = mongoose.model('Application-Config', ApplicationConfigSchema);