import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import SuggestionConfig from '@schemas/SuggestionConfig';
import { ISuggestionConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getSuggestConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<ISuggestionConfig>({
    Schema: SuggestionConfig,
    query: { guildId },
    cacheName: `${guildId}-suggest-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
      channelId: 'none',
      logEnabled: false,
      logChannelId: 'none',
      message: {
        content: '',
        title: 'New Suggestion!',
        color: '#8f8d8d',
        timestamp: true,
        footer: {
          text: 'Vote with the 🟢 and 🔴 below this message.',
          icon: '',
        },
        author: {
          text: '',
          icon: '',
          url: '',
        },
        description: '',
        fields: [
          { name: 'Suggestion', value: '{suggestion}', inline: false },
          { name: 'Suggested By', value: '{user}', inline: true },
        ],
        url: '',
        thumbnail: '',
        image: '',
      },
      emojiRed: '🔴',
      emojiGreen: '🟢',
      reasonRequired: true,
      dm: true,
      dmMessage: {
        content: '',
        title: 'Your suggestion was {state}!',
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
        description: 'Hello {user}! Your suggestion in {server} was {state} by {staff}!',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },
      colors: {
        approve: '#40ff3d',
        deny: '#ff3d3d',
        pending: '#8f8d8d',
        deleted: '#b30000',
      },
    },
  });
}
