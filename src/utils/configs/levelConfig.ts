import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import LevelConfig from '@schemas/LevelConfig';
import { ILevelConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getLevelConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<ILevelConfig>({
    Schema: LevelConfig,
    query: { guildId },
    cacheName: `${guildId}-level-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
      channel: 'current', // none, current, other

      messageType: 'embed', // Embed, Text or card
      levelCard: {
        bg: {
          type: 'color', // none, color and image // default: color
          color: '#2B2D31', // default: #2B2D31
          image: 'amsterdam', // default: amsterdam,
          image_overlay: 'rgba(0,0,0,0.6)', // default: rgba(0,0,0,0.6)
        },

        border: {
          enabled: false, // default false
          color: '#ffffff', // default #fff
          size: 10, // default 10
        },

        colors: {
          accent: '#37CF74', // default: #37CF74,
          displayname: '#ffffff', // default: #fff,
          username: '#B5B9BF', // default: #B5B9BF,
          xp: '#ffffff', // default: #fff,
          xp_bar: '#1E1F22', // default: #1E1F22,

          level_bg: '#1E1F22', // default: #1E1F22,
          level_text: '#B5B9BF', // default: #B5B9BF,
        },

        pfp: {
          rounded: true, // default true
        },
      },
      message: {
        content: '{user} leveled up to level {level}!',
        title: '{user.displayname} leveled up!',
        color: '{color}',
        timestamp: true,
        footer: {
          text: '',
          icon: '',
        },
        author: {
          text: '',
          icon: '',
          url: '',
        },
        description: '{user} is now level **{level}** with **{xp}** xp!',
        fields: [],
        url: '',
        thumbnail: '{user.avatar_url}',
        image: '',
      },

      dmEnabled: false,
      dmType: 'embed',
      dmMessage: {
        content:
          'You leveled up in **{server}** to level {level}. You now have {xp} xp and need {required_xp} for the next level.',
        title: '{user.displayname} leveled up!',
        color: '{color}',
        timestamp: true,
        footer: {
          text: '',
          icon: '',
        },
        author: {
          text: '',
          icon: '',
          url: '',
        },
        description: '{user} is now level **{level}** with **{xp}** xp!',
        fields: [],
        url: '',
        thumbnail: '{avatar}',
        image: '',
      },

      voiceXp: true,
      voiceXpMultiplier: 1,
      xpMultiplier: 1,

      commandXp: true, // xp when quabot interactions are done
      commandXpMultiplier: 0.5,

      rewardsMode: 'stack',
      removeRewards: true,

      rewardDm: false,
      rewardDmType: 'embed',
      rewardDmMessage: {
        content: 'You received the role {reward} in **{server}** for surpassing level {level}!',
        title: 'Reward received!',
        color: '{color}',
        timestamp: true,
        footer: {
          text: '',
          icon: '',
        },
        author: {
          text: '',
          icon: '',
          url: '',
        },
        description: 'You received the role {role} in **{server}** for surpassing level **{level}**!',
        fields: [],
        url: '',
        thumbnail: '{avatar}',
        image: '',
      },

      viewCard: false,
      leaderboardPublic: false,
    },
  });
}
