import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import WelcomeConfig from '@schemas/WelcomeConfig';
import { IWelcomeConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getWelcomeConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<IWelcomeConfig>({
    Schema: WelcomeConfig,
    query: { guildId },
    cacheName: `${guildId}-welcome-config`,
    client,
    defaultObj: {
      guildId,

      joinEnabled: false,
      joinChannel: 'none',
      joinType: 'embed',
      joinMessage: {
        content: '',
        title: 'Welcome {username}!',
        color: '{color}',
        timestamp: true,
        footer: {
          text: '',
          icon: '',
        },
        author: {
          text: '@{username}',
          icon: '{avatar}',
          url: '',
        },
        description: 'Welcome to **{server}**, {user}! You are the {members}th member.',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },

      leaveEnabled: false,
      leaveChannel: 'none',
      leaveType: 'embed',
      leaveMessage: {
        content: '',
        title: 'Goodbye {username}!',
        color: '{color}',
        timestamp: true,
        footer: {
          text: '',
          icon: '',
        },
        author: {
          text: '@{username}',
          icon: '{avatar}',
          url: '',
        },
        description: '{user} left **{server}**.',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },

      joinRoleEnabled: true,

      joinDM: false,
      joinDMType: 'embed',
      dm: {
        content: '',
        title: 'Welcome to {server}!',
        color: '{color}',
        timestamp: true,
        footer: {
          text: '',
          icon: '',
        },
        description: "You can add the server's rules here.",
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
        author: {
          text: '',
          icon: '',
          url: '',
        },
      },
    },
  });
}
