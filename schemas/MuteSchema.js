const mongoose = require('mongoose');

const MuteSchema = new mongoose.Schema({
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
    muteReason: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    muteTime: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
});

module.exports = mongoose.model('Mutes', MuteSchema);