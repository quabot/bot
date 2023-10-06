/* eslint-disable no-mixed-spaces-and-tabs */
const { Client } = require('discord.js');
const GiveawayConfig = require('@schemas/GiveawayConfig');

/**
 * @param {Client} client
 */
const getGiveawayConfig = async (client, guildId) => {
  const giveawayConfig =
    client.cache.get(`${guildId}-giveaway-config`) ??
    (await GiveawayConfig.findOne({ guildId }, (err, suggest) => {
      if (err) console.log(err);
      if (!suggest)
        new GiveawayConfig({
          guildId,
          enabled: true,
          pingEveryone: false,
        }).save();
    })
      .clone()
      .catch(() => {}));

  client.cache.set(`${guildId}-giveaway-config`, giveawayConfig);
  return giveawayConfig;
};

module.exports = { getGiveawayConfig };
