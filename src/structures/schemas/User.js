const { Schema, model } = require("mongoose");
const { reqString, reqNum } = require("../../utils/constants/schemas");

const User = new Schema({
    guildId: reqString,
    userId: reqString,

    bans: reqNum,
    tempbans: reqNum,
    warns: reqNum,
    kicks: reqNum,
    timeouts: reqNum,

    typeScore: reqNum,
    quizScore: reqNum
});

module.exports = model('User', User);
