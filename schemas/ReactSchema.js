const mongoose = require('mongoose');

const ReactSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    messageId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    emoji: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    reactMode: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    role: {
        type: mongoose.SchemaTypes.String,
        required: true,
    }
});

module.exports = mongoose.model('React', ReactSchema);