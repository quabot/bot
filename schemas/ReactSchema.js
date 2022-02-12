const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const ReactSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    messageId: reqString,
    emoji: reqString,
    reactMode: reqString,
    role: reqString
});

module.exports = mongoose.model('React', ReactSchema);