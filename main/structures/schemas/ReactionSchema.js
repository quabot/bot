const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const ReactionSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    messageId: reqString,
    emoji: reqString,
    reactMode: reqString,
    role: reqString
});

module.exports = mongoose.model('Reaction', ReactionSchema);