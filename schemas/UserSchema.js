const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    typeScore: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    kickCount: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    banCount: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    muteCount: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    warnCount: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    afk: {
        type: mongoose.SchemaTypes.Boolean,
        required: false,
    },
    afkStatus: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
});

module.exports = mongoose.model('User', UserSchema);