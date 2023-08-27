/* eslint-disable no-mixed-spaces-and-tabs */
const { Client } = require("discord.js");
const Server = require("@schemas/Server");

/**
 * @param {Client} client
 */
const getServerConfig = async (client, guildId) => {
  const serverConfig =
    client.cache.get(`${guildId}-server-config`) ??
    (await Server.findOne({ guildId }, (err, server) => {
      if (err) console.log(err);
      if (!server)
        new Server({
          guildId,
          locale: "en-us",
          color: "#416683",
          updatesChannel: "none",
          disabledCommands: [],
        }).save();
    })
      .clone()
      .catch(() => {}));

  client.cache.set(`${guildId}-server-config`, serverConfig);
  return serverConfig;
};

module.exports = { getServerConfig };
