import { Client } from '@classes/discord';
import { getFromCollection } from '@functions/mongoose';
import StarMessagesConfig from '@schemas/StarMessagesConfig';
import { IStarMessagesConfig } from '@typings/mongoose';
import { Snowflake } from 'discord.js';

export async function getStarMessagesConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IStarMessagesConfig>({
    Schema: StarMessagesConfig,
    query: { guildId },
    cacheName: `${guildId}-star-messages-config`,
    client,
    defaultObj: {
      guildId,
      enabled: true,
      channel: 'none',
      minStars: 5,
      emoji: '⭐',
      message: {
        content: '{emoji} {stars} | {channel}',
        title: '',
        color: '{color}',
        timestamp: true,
        footer: {
          text: '',
          icon: '',
        },
        author: {
          text: '@{user.username}',
          icon: '{user.avatarUrl}',
          url: '',
        },
        description: '{message.content}\n\n**[Click to jump to message!]({message.url})**',
        fields: [],
        url: '',
        thumbnail: '{user.avatarUrl}',
        image: '',
      },
      ignoredChannels: [],
      notifyUser: true,
    },
  });
}
