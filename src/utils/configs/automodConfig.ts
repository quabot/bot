import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import { IAutomodConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';
import AutomodConfig from '@schemas/Automod-Config';

export async function getAutomodConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IAutomodConfig>({
    Schema: AutomodConfig,
    query: { guildId },
    cacheName: `${guildId}-automod-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
      ignoredChannels: [],
      alert: true,
      deleteAlertAfter: 5,
      ignoredRoles: [],
      logChannel: 'none',
      logsEnabled: true,
      serverInvites: {
        enabled: false,
        action: 'warn',
        duration: '1d',
      },
      externalLinks: {
        enabled: false,
        action: 'warn',
        duration: '1d',
      },
      excessiveCaps: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        percentage: 70,
      },
      excessiveEmojis: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        percentage: 70,
      },
      excessiveMentions: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        mentions: 4,
      },
      excessiveSpoilers: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        percentage: 70,
      },
      newLines: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        lines: 10,
      },
      profanityFilter: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        extraWords: [],
        removedWords: [],
      },
      chatCooldown: {
        enabled: false,
        messageLimit: 3,
        duration: 5
      },
      attachmentsCooldown: {
        enabled: false,
        messageLimit: 3,
        duration: 5
      },
      mentionsCooldown: {
        enabled: false,
        messageLimit: 3,
        duration: 5
      },
      repeatedText: {
        enabled: false,
        action: 'warn',
        duration: 30,
        messageLimit: 3,
        percentage: 70,
      }
    },
  });
}
