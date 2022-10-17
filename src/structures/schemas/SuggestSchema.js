const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqBool = {
    type: Boolean,
    required: true,
};

const SuggestSchema = new mongoose.Schema({
    guildId: reqString,
    suggestId: reqString,
    suggestMsgId: reqString,
    suggestion: reqString,
    suggestionStatus: reqString,
    suggestionUserId: reqString,
});

module.exports = mongoose.model('Suggestion', SuggestSchema);
