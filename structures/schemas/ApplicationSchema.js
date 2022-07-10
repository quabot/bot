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

const reqNum = {
    type: Number,
    required: true,
}

const ApplicationSchema = new mongoose.Schema({
    guildId: reqString,
    applicationNumId: reqNum,
    applicationTextId: reqString,
    applicationName: reqString,
    applicationItems: reqArray,
    requiredPermission: reqString,
    applicationDescription: reqString,
    applicationMultipleAnswers: reqBool,
});

module.exports = mongoose.model('Application', ApplicationSchema);