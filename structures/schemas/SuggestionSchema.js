const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const SuggestionSchema = new mongoose.Schema({
    guildId: reqString,
    suggestId: reqString,
    suggestMsgId: reqString,
    suggestion: reqString,
    suggestionStatus: reqString,
    suggestionUserId: reqString,
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);