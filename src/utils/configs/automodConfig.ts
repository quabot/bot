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
      ignoredRoles: [],
      logChannel: 'none',
      logsEnabled: true,
      serverInvites: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        alert: true,
        deleteAlertAfter: 15,
      },
      externalLinks: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        alert: true,
        deleteAlertAfter: 15,
      },
      excessiveCaps: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        alert: true,
        deleteAlertAfter: 15,
        percentage: 70,
      },
      excessiveEmojis: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        alert: true,
        deleteAlertAfter: 15,
        percentage: 70,
      },
      excessiveMentions: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        alert: true,
        deleteAlertAfter: 15,
        mentions: 4,
      },
      excessiveSpoilers: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        alert: true,
        deleteAlertAfter: 15,
        percentage: 70,
      },
      newLines: {
        enabled: false,
        action: 'warn',
        duration: '1d',
        alert: true,
        deleteAlertAfter: 15,
        lines: 10,
      },
    },
  });
}
