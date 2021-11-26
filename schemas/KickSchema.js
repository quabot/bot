const mongoose = require('mongoose');

const KickSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    kickReason: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    kickTime: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
});

module.exports = mongoose.model('Kicks', KickSchema);