import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import LoggingConfig from '@schemas/LoggingConfig';
import { ILoggingConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';
import { Types } from 'mongoose';

export async function getLoggingConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<ILoggingConfig>({
    Schema: LoggingConfig,
    query: { guildId },
    cacheName: `${guildId}-logging-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
      excludedChannels: new Types.Array(),
      excludedCategories: new Types.Array(),
      events: new Types.Array(
        {
          channelId: 'none',
          event: 'emojiCreate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'emojiDelete',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'emojiUpdate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'voiceJoinLeave',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'voiceMove',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'guildBanAdd',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'guildBanRemove',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'roleAddRemove',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'nickChange',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'channelCreate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'channelDelete',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'channelUpdate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'inviteCreate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'inviteDelete',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'messageDelete',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'messageUpdate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'roleCreate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'roleDelete',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'roleUpdate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'stickerCreate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'stickerDelete',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'stickerUpdate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'threadCreate',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'threadDelete',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'guildMemberAdd',
          enabled: true,
        },
        {
          channelId: 'none',
          event: 'guildMemberRemove',
          enabled: true,
        },
      ),
      logBotActions: true,
    },
  });
}