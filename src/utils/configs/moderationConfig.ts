import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import ModerationConfig from '@schemas/ModerationConfig';
import { IModerationConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getModerationConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<IModerationConfig>({
    Schema: ModerationConfig,
    query: { guildId },
    cacheName: `${guildId}-moderation-config`,
    client,
    defaultObj: {
      guildId,
      channel: false,
      channelId: 'none',

      warnDM: true,
      warnDMMessage: {
        content: '',
        title: 'You were warned!',
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
        description: 'You were warned on **{server}**.\n**Warned by:** {moderator}\n**Reason:** {reason}',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },

      timeoutDM: true,
      timeoutDMMessage: {
        content: '',
        title: 'You were timed out!',
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
        description:
          'You were timed out on **{server}**.\n**Timed out by:** {moderator}\n**Duration:** {duration}\n**Reason:** {reason}',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },

      kickDM: true,
      kickDMMessage: {
        content: '',
        title: 'You were kicked!',
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
        description: 'You were kicked from **{server}**.\n**Kicked by:** {moderator}\n**Reason:** {reason}',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },

      banDM: true,
      banDMMessage: {
        content: '',
        title: 'You were banned!',
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
        description: 'You were banned from **{server}**.\n**Banned by:** {moderator}\n**Reason:** {reason}',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },

      tempbanDM: true,
      tempbanDMMessage: {
        content: '',
        title: 'You were temporarily banned!',
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
        description:
          'You were banned from **{server}**.\n**Banned by:** {moderator}\n**Unban after:** {duration}\n**Reason:** {reason}',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },

      reportEnabled: true,
      reportChannelId: 'none',
    },
  });
}
