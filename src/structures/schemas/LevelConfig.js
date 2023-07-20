const { Schema, model } = require("mongoose");
const { reqString, reqBool, reqArray, reqObject, reqNum } = require("../../utils/constants/schemas");

const LevelConfig = new Schema({
    guildId: reqString,
    enabled: reqBool,
    channel: reqString,

    messageType: reqString, // none, current, other
    levelCard: reqObject,
    messageText: reqString,
    message: reqObject,

    dmMessageEnabled: reqBool,
    dmMessageEmbed: reqBool,
    dmMessageText: reqString,
    dmMessage: reqObject,

    voiceXp: reqBool,
    voiceXpMultiplier: reqNum,
    xpMultiplier: reqNum,
    
    excludedChannels: reqArray, 
    excludedRoles: reqArray,

    rewards: reqArray,
    rewardsMode: reqString,
});

module.exports = model('Level-Config', LevelConfig);