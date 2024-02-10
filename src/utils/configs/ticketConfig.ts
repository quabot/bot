import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import TicketConfig from '@schemas/TicketConfig';
import { ITicketConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';
import { Types } from 'mongoose';

export async function getTicketConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<ITicketConfig>({
    Schema: TicketConfig,
    query: { guildId },
    cacheName: `${guildId}-ticket-config`,
    client,
    defaultObj: {
      guildId,

      enabled: false,
      openCategory: 'none',
      closedCategory: 'none',

      guildMax: -1,
      userMax: -1,
      deleteOnClose: true,

      staffPing: 'none',
      topicButton: true,

      dmEnabled: false,
      dmMessages: {
        add: {
          enabled: false,
          type: 'embed',
          message: {
            content: '{user} has been added to {ticket}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: '{user} has been added to {ticket}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        claim: {
          enabled: false,
          type: 'embed',
          message: {
            content: '{ticket} has been claimed by {ticket.staff}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: '{ticket} has been claimed by {ticket.staff}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        close: {
          enabled: false,
          type: 'embed',
          message: {
            content: '{ticket} has been closed by {user}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: '{ticket} has been closed by {user}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        create: {
          enabled: false,
          type: 'embed',
          message: {
            content: 'Your ticket {ticket} has been created!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: 'Your ticket {ticket} has been created!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        delete: {
          enabled: false,
          type: 'embed',
          message: {
            content: '{ticket} has been deleted by {user}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: '{ticket} has been deleted by {user}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        remove: {
          enabled: false,
          type: 'embed',
          message: {
            content: '{user} has been removed from {ticket}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: '{user} has been removed from {ticket}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        rename: {
          enabled: false,
          type: 'embed',
          message: {
            content: '{ticket} has been renamed to {ticket.topic}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: '{ticket} has been renamed to {ticket.topic}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        reopen: {
          enabled: false,
          type: 'embed',
          message: {
            content: '{ticket} has been reopened by {user}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: '{ticket} has been reopened by {user}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        transfer: {
          enabled: false,
          type: 'embed',
          message: {
            content: 'The owner of {ticket} has been changed to {ticket.owner}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: 'The owner of {ticket} has been changed to {ticket.owner}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
        unclaim: {
          enabled: false,
          type: 'embed',
          message: {
            content: '{ticket} has been unclaimed by {user}!',
            title: '',
            color: '{color}',
            timestamp: false,
            footer: {
              text: '',
              icon: '',
            },
            author: {
              text: '',
              icon: '',
              url: '',
            },
            description: '{ticket} has been unclaimed by {user}!',
            fields: [],
            url: '',
            thumbnail: '',
            image: '',
          },
        },
      },

      logChannel: 'none',
      logActions: new Types.Array('claim', 'close', 'create', 'delete', 'reopen', 'unclaim'),
      logEnabled: false,
    },
  });
}
