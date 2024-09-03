import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import { IAutomationConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';
import AutomationConfig from '@schemas/AutomationConfig';

export async function getAutomationConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IAutomationConfig>({
    Schema: AutomationConfig,
    query: { guildId },
    cacheName: `${guildId}-automation-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
      buttons: [],
    },
  });
}
