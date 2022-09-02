const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const ModerationSchema = new mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
});

module.exports = mongoose.model('Moderation-Config', ModerationSchema);