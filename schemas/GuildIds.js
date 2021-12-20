const mongoose = require('mongoose');

const GIdSchema = new mongoose.Schema({
    gId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    verifyToken: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    suggestId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    pollId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    ticketId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
});

module.exports = mongoose.model('GIds', GIdSchema);