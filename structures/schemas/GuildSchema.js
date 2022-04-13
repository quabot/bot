const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const GuildSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    logChannelID: reqString,
    suggestChannelID: reqString,
    welcomeChannelID: reqString,
    levelChannelID: reqString,
    // punishment channel id
    logEnabled: reqString,
    levelEnabled: reqString,
    suggestEnabled: reqString,
    welcomeEnabled: reqString,
    roleEnabled: reqString,
    mainRole: reqString,
    joinMessage: reqString,
    leaveMessage: reqString,
    swearEnabled: reqString,
});

module.exports = mongoose.model('Guild', GuildSchema);