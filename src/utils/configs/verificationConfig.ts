import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import { IVerificationConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';
import VerificationConfig from '@schemas/VerificationConfig';

export async function getVerificationConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IVerificationConfig>({
    Schema: VerificationConfig,
    query: { guildId },
    cacheName: `${guildId}-verification-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
      roles: [],
      removeRoles: [],
      dm: false,
      dmMessage: {
        content: '',
        title: 'Welcome to {server.name}, you just need to verify to get access!',
        color: '{color}',
        timestamp: true,
        footer: { text: '', icon: '' },
        author: { text: '', icon: '', url: '' },
        description: 'In order to get verified and get access to all the server channels, please solve a captcha by clicking the button below this message.',
        fields: [],
        url: '',
        thumbnail: '',
        image: ''
      },
      type: 'bot-captcha',
      cooldown: '1min',
    },
  });
}
