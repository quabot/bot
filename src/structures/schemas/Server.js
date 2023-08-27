const { Schema, model } = require("mongoose");
const { reqString, reqArray } = require("@constants/schemas");

const ServerSchema = new Schema({
  guildId: reqString,
  locale: reqString,
  color: reqString,
  updatesChannel: reqString,
  disabledCommands: reqArray,
});

module.exports = model("Server", ServerSchema);
