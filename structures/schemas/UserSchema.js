const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}
const reqBool = {
    type: Boolean,
    required: true,
}

const UserSchema = new mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    guildName: reqString,
    banCount: reqNumber,
    kickCount: reqNumber,
    timeoutCount: reqNumber,
    warnCount: reqNumber,
    updateNotify: reqBool,
    notifOpened: reqBool,
    lastNotify: reqString,
    afk: reqBool,
    afkMessage: reqString,
});

module.exports = mongoose.model('User', UserSchema);