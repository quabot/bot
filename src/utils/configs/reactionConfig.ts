import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import ReactionConfig from '@schemas/ReactionConfig';
import { IReactionConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getReactionConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<IReactionConfig>({
    Schema: ReactionConfig,
    query: { guildId },
    cacheName: `${guildId}-reaction-config`,
    client,
    defaultObj: {
      guildId,
      enabled: true,
      dmEnabled: false,
      dm: {
        content: '',
        title: 'Role {action}',
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
        description: 'Your role ({role}) in **{server}** has been {action}.',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },
    },
  });
}
