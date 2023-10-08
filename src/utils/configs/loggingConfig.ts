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
      channelId: 'none',
      excludedChannels: [],
      excludedCategories: [],
      events: new Types.Array(
        'emojiCreate',
        'emojiDelete',
        'emojiUpdate',
        'guildBanAdd',
        'guildBanRemove',
        'roleAddRemove',
        'nickChange',
        'channelCreate',
        'channelDelete',
        'channelUpdate',
        'inviteCreate',
        'inviteDelete',
        'messageDelete',
        'messageUpdate',
        'roleCreate',
        'roleDelete',
        'roleUpdate',
        'stickerCreate',
        'stickerDelete',
        'stickerUpdate',
        'threadCreate',
        'threadDelete',
      ),
    },
  });
}
