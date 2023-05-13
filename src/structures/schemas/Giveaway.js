const { Schema, model } = require("mongoose");
const { reqString, reqId, reqBool, reqNum } = require("../../utils/constants/schemas");

const Giveaway = new Schema({
    guildId: reqString,
    afkEnabled: reqBool
});

module.exports = model('Giveaway', Giveaway);