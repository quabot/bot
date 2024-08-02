import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import { IBoostConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';
import BoostConfig from '@schemas/BoostConfig';

export async function getBoostConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IBoostConfig>({
    Schema: BoostConfig,
    query: { guildId },
    cacheName: `${guildId}-boost-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
      channel: 'none',
      message: {
        content: '',
        title: '@{user.username} just boosted the server!',
        color: '{color}',
        timestamp: true,
        footer: { text: '', icon: '' },
        author: { text: '', icon: '', url: '' },
        description: 'Thank you for boosting the server! The server now has {boosts} boosts and is tier {tier}.',
        fields: [],
        url: '',
        thumbnail: '',
        image: ''
      },
      type: 'embed'
    },
  });
}
