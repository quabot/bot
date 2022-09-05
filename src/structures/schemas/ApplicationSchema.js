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

const ApplicationSchema = new mongoose.Schema({
    guildId: reqString,
    applicationId: reqString,
    applicationName: reqString,
    applicationReward: reqString,
    applicationItems: reqArray,
    requiredPermission: reqString,
    applicationDescription: reqString,
    applicationReapply: reqBool,
});

module.exports = mongoose.model('Application', ApplicationSchema);