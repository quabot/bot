const { Schema, model } = require("mongoose");
const { reqString, reqId, reqBool } = require("@constants/schemas");

const PollConfig = new Schema({
  guildId: reqString,
  enabled: reqBool,
  logEnabled: reqBool,
  logChannel: reqString,
});

module.exports = model("Poll-Config", PollConfig);
