const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const GuildSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    logChannelID: reqString,
    reportChannelID: reqString,
    suggestChannelID: reqString,
    welcomeChannelID: reqString,
    levelChannelID: reqString,
    pollChannelID: reqString,
    ticketCategory: reqString,
    closedTicketCategory: reqString,
    logEnabled: reqString,
    musicEnabled: reqString,
    levelEnabled: reqString,
    reportEnabled: reqString,
    suggestEnabled: reqString,
    ticketEnabled: reqString,
    welcomeEnabled: reqString,
    pollsEnabled: reqString,
    roleEnabled: reqString,
    mainRole: reqString,
    mutedRole: reqString,
    joinMessage: reqString,
    leaveMessage: reqString,
    swearEnabled: reqString,
    transcriptChannelID: reqString,
    prefix: reqString,
});

module.exports = mongoose.model('Guild', GuildSchema);