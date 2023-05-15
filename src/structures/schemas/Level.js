const { Schema, model } = require("mongoose");
const { reqString, reqNum } = require("../../utils/constants/schemas");

const LevelSchema = new Schema({
    guildId: reqString,
    userId: reqString,
    xp: reqNum,
    level: reqNum,
    role: reqString,
    lastVote: reqString
});

module.exports = model('Level', LevelSchema);