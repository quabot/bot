const { Schema, model } = require("mongoose");
const { reqString, reqNum, reqBool } = require("@constants/schemas");

const LevelSchema = new Schema({
  guildId: reqString,
  userId: reqString,
  xp: reqNum,
  level: reqNum,
  role: reqString,
  active: reqBool,
});

module.exports = model("Level", LevelSchema);
