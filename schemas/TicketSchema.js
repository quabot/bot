const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqBool = {
    type: Boolean,
    required: true,
}

const TicketSchema = new mongoose.Schema({
    guildId: reqString,
    memberId: reqString,
    ticketId: reqString,
    channelId: reqString,
    closed: reqBool,
    topic: reqString,
});

module.exports = mongoose.model('Tickets', TicketSchema);