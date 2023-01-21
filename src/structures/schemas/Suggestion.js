const { Schema, model } = require("mongoose");
const { reqString, reqNum } = require("../../utils/constants/schemas");

const SuggestionSchema = new Schema({
    guildId: reqString,
    id: reqNum,
    msgId: reqString,
    suggestion: reqString,
    status: reqString,
    userId: reqString,
});

module.exports = model('Suggestion', SuggestionSchema);