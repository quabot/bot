/* eslint-disable no-mixed-spaces-and-tabs */
const { Client } = require('discord.js');
const SuggestConfig = require('@schemas/SuggestionConfig');

/**
 * @param {Client} client
 */
const getSuggestConfig = async (client, guildId) => {
  const suggestConfig =
    client.cache.get(`${guildId}-suggest-config`) ??
    (await SuggestConfig.findOne({ guildId }, (err, suggest) => {
      if (err) console.log(err);
      if (!suggest)
        new SuggestConfig({
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
          colors: { approve: '#40ff3d', deny: '#ff3d3d', pending: '#8f8d8d', deleted: ' #b30000' },
        }).save();
    })
      .clone()
      .catch(() => {}));

  client.cache.set(`${guildId}-suggest-config`, suggestConfig);
  return suggestConfig;
};

module.exports = { getSuggestConfig };
