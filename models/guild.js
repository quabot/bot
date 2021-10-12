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
    suggestEnabled: String,
    suggestChannelID: String,
    ticketEnabled: String,
    ticketChannelName: String,
    closedTicketCategoryName: String,
    welcomeEnabled: String,
    welcomeChannelID: String,
    enableNSFWContent: String,
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');