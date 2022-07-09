const mongoose = require('mongoose');

const reqString = {
    type: String,
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


const TicketConfigSchema = new mongoose.Schema({
    guildId: reqString,
    ticketCategory: reqString,
    ticketClosedCategory: reqString,
    ticketEnabled: reqBool,
    ticketStaffPing: reqBool,
    ticketTopicButton: reqBool,
    ticketSupport: reqString,
    ticketId: reqNum,
    ticketLogs: reqBool,
    ticketChannelID: reqString,
});

module.exports = mongoose.model('TicketConfig', TicketConfigSchema);