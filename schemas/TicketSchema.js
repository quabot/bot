const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    memberId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    ticketId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    channelId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    closed: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
    },
    topic: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
});

module.exports = mongoose.model('Tickets', TicketSchema);