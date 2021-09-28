const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    prefix: String,
    logChannelID: String,
    enableLog: String,
    enableSwearFilter: String,
    enableMusic: String,
    enableLevel: String,
    mutedRoleName: String,
    mainRoleName: String,
    reportEnabled: String,
    reportChannelID: String,
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');