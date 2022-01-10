const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: false,
}

const IdsSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    pollMessageId: reqString,
    pollId: reqString,
    pollName: reqString,
    suggestionMessageId: reqString,
    suggestionId: reqString,
    suggestionName: reqString,
});

module.exports = mongoose.model('Ids', IdsSchema);