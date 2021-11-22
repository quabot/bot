const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    logChannelID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    reportChannelID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    suggestChannelID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    welcomeChannelID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    levelChannelID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    pollChannelID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    ticketCategory: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    closedTicketCategory: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    logEnabled: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    musicEnabled: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    levelEnabled: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    reportEnabled: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    suggestEnabled: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    ticketEnabled: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    welcomeEnabled: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    pollsEnabled: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    mainRole: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    mutedRole: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
});

module.exports = mongoose.model('Guild', GuildSchema);