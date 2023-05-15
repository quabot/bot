const { Schema, model } = require("mongoose");
const { reqString, reqId, reqBool, reqArray, reqObject } = require("../../utils/constants/schemas");

const LevelConfig = new Schema({
    guildId: reqString,
    enabled: reqBool, //levels enabled?
    channel: reqString,  // level up channel (if none, in channel where happened, if disabled, nothing will happen)
    messageEmbed: reqBool, // If true: embed, if false: text
    message: reqObject, // the level up message

    dmMessageEnabled: reqBool, // if true, the message will be sent in dms (as well)
    dmMessageEmbed: reqBool,
    dmMessage: reqObject,
    
    excludedChannels: reqArray, 
    excludedRoles: reqArray,
    rewards: reqArray
});

module.exports = model('Level-Config', LevelConfig);