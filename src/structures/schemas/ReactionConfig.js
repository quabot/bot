const { Schema, model } = require("mongoose");
const { reqString, reqBool, reqObject } = require("../../utils/constants/schemas");

const ReactionConfig = new Schema({
    guildId: reqString,
    enabled: reqBool,
    dmEnabled: reqBool,
    dm: reqObject
});

module.exports = model('Reaction-Config', ReactionConfig);