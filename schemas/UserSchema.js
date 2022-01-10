const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}
const falseBool = {
    type: Boolean,
    required: false,
}

const UserSchema = new mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    guildName: reqString,
    typeScore: reqNumber,
    kickCount: reqNumber,
    banCount: reqNumber,
    muteCount: reqNumber,
    warnCount: reqNumber,
    afk: falseBool,
    afkStatus: falseBool,
});

module.exports = mongoose.model('User', UserSchema);