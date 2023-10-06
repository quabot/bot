/* eslint-disable no-mixed-spaces-and-tabs */
const { Client } = require('discord.js');
const PollConfig = require('@schemas/PollConfig');

/**
 * @param {Client} client
 */
const getPollConfig = async (client, guildId) => {
  const pollConfig =
    client.cache.get(`${guildId}-poll-config`) ??
    (await PollConfig.findOne({ guildId }, (err, suggest) => {
      if (err) console.log(err);
      if (!suggest)
        new PollConfig({
          guildId,
          enabled: true,
          logEnabled: false,
          logChannel: 'none',
        }).save();
    })
      .clone()
      .catch(() => {}));

  client.cache.set(`${guildId}-poll-config`, pollConfig);
  return pollConfig;
};

module.exports = { getPollConfig };
