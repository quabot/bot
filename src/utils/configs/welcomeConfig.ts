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
        description: 'Welcome to **{server}**, {user.displayname}! You are the {members}th member.',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
      },
      joinCard: {
        bg: {
          type: 'color', // none, color and image // default: color
          color: '#2B2D31', // default: #2B2D31
          image: 'amsterdam', // default: amsterdam,
          image_overlay: 'rgba(0,0,0,0.6)', // default: rgba(0,0,0,0.6)
        },

        border: {
          enabled: false, // default false
          color: '#ffffff', // default #fff
          size: 10, // default 10
        },

        welcomeTxt: {
          enabled: true,
          color: '#fff',
          weight: 'SemiBold',
          value: 'Welcome {user.display_name}!',
        },
        memberTxt: {
          enabled: true,
          color: '#B5B9BF',
          weight: 'Normal',
          value: 'You are the {server.members}th member!',
        },
        customTxt: {
          enabled: false,
          color: '#f00',
          weight: 'Normal',
          value: "Use this text to add some extra text.",
        },

        pfp: {
          rounded: true, // default true
        },
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
      leaveCard: {
        bg: {
          type: 'color', // none, color and image // default: color
          color: '#2B2D31', // default: #2B2D31
          image: 'amsterdam', // default: amsterdam,
          image_overlay: 'rgba(0,0,0,0.6)', // default: rgba(0,0,0,0.6)
        },

        border: {
          enabled: false, // default false
          color: '#ffffff', // default #fff
          size: 10, // default 10
        },

        welcomeTxt: {
          enabled: true,
          color: '#fff',
          weight: 'SemiBold',
          value: 'Goodbye {user.displayname}!',
        },
        memberTxt: {
          enabled: true,
          color: '#B5B9BF',
          weight: 'Normal',
          value: 'Only {server.members} left!',
        },
        customTxt: {
          enabled: true,
          color: '#f00',
          weight: 'Normal',
          value: 'We hope that this will never happen again :(',
        },

        pfp: {
          rounded: true, // default true
        },
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
      dmCard: {
        bg: {
          type: 'color', // none, color and image // default: color
          color: '#2B2D31', // default: #2B2D31
          image: 'amsterdam', // default: amsterdam,
          image_overlay: 'rgba(0,0,0,0.6)', // default: rgba(0,0,0,0.6)
        },

        border: {
          enabled: false, // default false
          color: '#ffffff', // default #fff
          size: 10, // default 10
        },

        welcomeTxt: {
          enabled: true,
          color: '#fff',
          weight: 'SemiBold',
          value: 'Welcome {user.displayname}!',
        },
        memberTxt: {
          enabled: true,
          color: '#B5B9BF',
          weight: 'Normal',
          value: 'You are the {server.members}th member!',
        },
        customTxt: {
          enabled: true,
          color: '#f00',
          weight: 'Normal',
          value: "We hope you're happy!",
        },

        pfp: {
          rounded: true, // default true
        },
      },
    },
  });
}
