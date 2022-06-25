const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const reqArray = {
    type: Array,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const GuildSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    logChannelID: reqString,
    suggestChannelID: reqString,
    logSuggestChannelID: reqString,
    logPollChannelID: reqString,
    welcomeChannelID: reqString,
    leaveChannelID: reqString,
    levelChannelID: reqString,
    punishmentChannelID: reqString,
    pollID: reqString,
    logEnabled: reqString,
    modEnabled: reqString,
    levelEnabled: reqString,
    levelRewards: reqArray,
    pollEnabled: reqString,
    suggestEnabled: reqString,
    welcomeEnabled: reqString,
    leaveEnabled: reqString,
    roleEnabled: reqString,
    mainRole: reqString,
    welcomeEmbed: reqString,
    joinMessage: reqString,
    leaveMessage: reqString,
    swearEnabled: reqString,
    levelCard: reqBool,
    levelEmbed: reqBool,
    levelMessage: reqString,
    afkEnabled: reqString,
    afkStatusAllowed: reqString,
    musicEnabled: reqString,
    musicOneChannelEnabled: reqString,
    musicChannelID: reqString,
    ticketCategory: reqString,
    ticketClosedCategory: reqString,
    ticketEnabled: reqBool,
    ticketStaffPing: reqBool,
    ticketTopicButton: reqBool,
    ticketSupport: reqString,
    ticketId: reqNum,
    ticketLogs: reqBool,
    ticketChannelID: reqString,
    membersChannel: reqString,
    membersMessage: reqString,
    funCommands: reqArray,
    infoCommands: reqArray,
    miscCommands: reqArray,
    moderationCommands: reqArray,
    managementCommands: reqArray,
    funEnabled: reqBool,
    infoEnabled: reqBool,
    miscEnabled: reqBool,
    moderationEnabled: reqBool,
    managementEnabled: reqBool,
});

module.exports = mongoose.model('Guild', GuildSchema);