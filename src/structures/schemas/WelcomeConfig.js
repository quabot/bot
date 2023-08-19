const { Schema, model } = require("mongoose");
const { reqString, reqNum, reqBool, reqObject, reqArray } = require("../../utils/constants/schemas");

const WelcomeConfig = new Schema({
    guildId: reqString,

    joinEnabled: reqBool,
    joinChannel: reqString,
    joinType: reqString,
    joinText: reqString,
    joinCard: reqObject,
    joinMessage: reqObject,

    leaveEnabled: reqBool,
    leaveChannel: reqString,
    leaveType: reqString,
    leaveText: reqString,
    leaveMessage: reqObject,

    role: reqArray,
    roleEnabled: reqBool,

    dm: reqBool,
    dmType: reqString,
    dmMessage: reqObject,
    dmText: reqString,
});

module.exports = model('Welcome-Config', WelcomeConfig);