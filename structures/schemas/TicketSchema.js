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

const TicketSchema = new mongoose.Schema({
    guildId: reqString,
    ticketId: reqNum,
    channelId: reqString,
    topic: reqString,
    closed: reqBool,
});

module.exports = mongoose.model('Tickets', TicketSchema);