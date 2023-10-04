import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray, reqObject, reqNum } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
  'Level-Config',
  new Schema({
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
  }),
);
