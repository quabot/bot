const { Schema, model } = require("mongoose");
const { reqString } = require("../../utils/constants/schemas");

const ServerSchema = new Schema({
    guildId: reqString,
    locale: reqString,
    color: reqString,
    updatesChannel: reqString
});

module.exports = model('Server', ServerSchema);