const { Schema, model } = require("mongoose");
const {
  reqString,
  reqBool,
  reqArray,
  reqObject,
  reqNum,
} = require("@constants/schemas");

const LevelConfig = new Schema({
  guildId: reqString,
  enabled: reqBool,
  channel: reqString,

  messageType: reqString, // none, current, other
  levelCard: reqObject,
  cardMention: reqBool,
  messageText: reqString,
  message: reqObject,

  dmEnabled: reqBool,
  dmType: reqString,
  dmMessageText: reqString,
  dmMessage: reqObject,

  voiceXp: reqBool,
  voiceXpMultiplier: reqNum,
  xpMultiplier: reqNum,

  commandXp: reqBool, // xp when quabot interactions are done
  commandXpMultiplier: reqNum,

  excludedChannels: reqArray,
  excludedRoles: reqArray,

  rewards: reqArray,
  rewardsMode: reqString, // 'stack' or 'replace'
  removeRewards: reqBool,

  rewardDm: reqBool,
  rewardDmType: reqString,
  rewardDmMessageText: reqString,
  rewardDmMessage: reqObject,

  viewCard: reqBool, // Show the level card on /level view
  leaderboardPublic: reqBool, // Should everyone be able to see the leaderboard
});

module.exports = model("Level-Config", LevelConfig);
