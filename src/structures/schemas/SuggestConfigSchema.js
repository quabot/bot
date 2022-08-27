const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const SuggestionConfigSchema = new mongoose.Schema({
    guildId: reqString,
    suggestEnabled: reqBool,
    suggestLogEnabled: reqBool,
    suggestChannelId: reqString,
    suggestLogChannelId: reqString,
    suggestReasonApproveDeny: reqBool,
    suggestEmojiSet: reqString,
});

module.exports = mongoose.model('Suggestion-Config', SuggestionConfigSchema);