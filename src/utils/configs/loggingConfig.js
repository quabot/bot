/* eslint-disable no-mixed-spaces-and-tabs */
const { Client } = require('discord.js');
const LoggingConfig = require('@schemas/LoggingConfig');

/**
 * @param {Client} client
 */
const getLoggingConfig = async (client, guildId) => {
  const loggingConfig =
    client.cache.get(`${guildId}-logging-config`) ??
    (await LoggingConfig.findOne({ guildId }, (err, log) => {
      if (err) console.log(err);
      if (!log)
        new LoggingConfig({
          guildId,
          enabled: false,
          channelId: 'none',
          excludedChannels: [],
          excludedCategories: [],
          events: [
            'emojiCreate',
            'emojiDelete',
            'emojiUpdate',
            'guildBanAdd',
            'guildBanRemove',
            'roleAddRemove',
            'nickChange',
            'channelCreate',
            'channelDelete',
            'channelUpdate',
            'inviteCreate',
            'inviteDelete',
            'messageDelete',
            'messageUpdate',
            'roleCreate',
            'roleDelete',
            'roleUpdate',
            'stickerCreate',
            'stickerDelete',
            'stickerUpdate',
            'threadCreate',
            'threadDelete',
          ],
        }).save();
    })
      .clone()
      .catch(() => {}));

  client.cache.set(`${guildId}-logging-config`, loggingConfig);
  return loggingConfig;
};

module.exports = { getLoggingConfig };
