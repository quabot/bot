const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
    verifToken: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    pollId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    suggestId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
});

module.exports = mongoose.model('Bot', BotSchema);