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

const VerificationSchema = new mongoose.Schema({
    guildId: reqString,
    verifyEnabled: reqBool,
    verifyLog: reqBool,
    logChannel: reqString,
    verifyChannel: reqString,
    verifyMessage: reqString,
    verifyRoles: reqArray,
    verifyCode: reqBool,
});

module.exports = mongoose.model('verification-config', VerificationSchema);