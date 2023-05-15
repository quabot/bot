const { Schema, model } = require("mongoose");
const { reqString, reqBool, optString, reqArray, optObject } = require("../../utils/constants/schemas");

const ResponderConfig = new Schema({
    guildId: reqString,
    trigger: reqString,
    wildcard: reqBool,

    type: reqString,
    embed: optObject,
    message: optString,
    reaction: optString,

    ignored_channels: reqArray,
    ignored_roles: reqArray,
});

module.exports = model('Responses', ResponderConfig);