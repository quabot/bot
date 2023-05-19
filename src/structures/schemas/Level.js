const { Schema, model } = require("mongoose");
const { reqString, reqNum, reqBool } = require("../../utils/constants/schemas");

const LevelSchema = new Schema({
    guildId: reqString,
    userId: reqString,
    xp: reqNum,
    level: reqNum,
    role: reqString,
    lastVote: reqString,
    active: reqBool,
});

module.exports = model('Level', LevelSchema);