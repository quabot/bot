import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray, reqObject, reqNum } from '@constants/schemas';
import type { ILevelConfig } from '@typings/schemas';

export default model<ILevelConfig>(
  'Level-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    channel: reqString,

    messageType: reqString, // none, current, other
    levelCard: reqObject,
    levelupCardContent: reqString,
    message: reqObject,

    dmEnabled: reqBool,
    dmType: reqString,
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
    rewardDmMessage: reqObject,

    viewCard: reqBool, // Show the level card on /level view
    leaderboardPublic: reqBool, // Should everyone be able to see the leaderboard
  }),
);
