const mongoose = require('mongoose');

const IdsSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    pollMessageId: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    pollId: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    pollName: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    suggestionMessageId: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    suggestionId: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    suggestionName: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
});

module.exports = mongoose.model('Ids', IdsSchema);