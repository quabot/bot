const { Schema, model } = require("mongoose");
const { reqString, reqNum, reqBool, reqObject } = require("@constants/schemas");

const SuggestionConfig = new Schema({
  guildId: reqString,

  enabled: reqBool,
  channelId: reqString,

  logEnabled: reqBool,
  logChannelId: reqString,

  message: reqObject,
  emojiRed: reqString,
  emojiGreen: reqString,

  reasonRequired: reqBool,
  dm: reqBool,
  dmMessage: reqObject,

  colors: reqObject,
});

module.exports = model("Suggestion-Config", SuggestionConfig);
