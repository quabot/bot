import { Client } from '@classes/discord';
import WelcomeConfig from '@schemas/WelcomeConfig';
import { Snowflake } from 'discord.js';

const getWelcomeConfig = async (client: Client, guildId: Snowflake) => {
  const welcomeConfig =
    client.cache.get(`${guildId}-welcome-config`) ??
    (await WelcomeConfig.findOne({ guildId }, (err, welcome) => {
      if (err) console.log(err);
      if (!welcome)
        new WelcomeConfig({
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

          joinRole: [],
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
        }).save();
    })
      .clone()
      .catch(() => {}));

  client.cache.set(`${guildId}-welcome-config`, welcomeConfig);
  return welcomeConfig;
};

module.exports = { getWelcomeConfig };
