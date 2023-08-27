/* eslint-disable no-mixed-spaces-and-tabs */
const { Client } = require("discord.js");
const ModerationConfig = require("@schemas/ModerationConfig");

/**
 * @param {Client} client
 */
const getModerationConfig = async (client, guildId) => {
  const moderationConfig =
    client.cache.get(`${guildId}-moderation-config`) ??
    (await ModerationConfig.findOne({ guildId }, (err, config) => {
      if (err) console.log(err);
      if (!config)
        new ModerationConfig({
          guildId,
          channel: false,
          channelId: "none",

          warnDM: true,
          warnDMMessage: {
            content: "",
            title: "You were warned!",
            color: "{color}",
            timestamp: true,
            footer: {
              text: "",
              icon: "",
            },
            author: {
              text: "",
              icon: "",
              url: "",
            },
            description:
              "You were warned on **{server}**.\n**Warned by:** {moderator}\n**Reason:** {reason}",
            fields: [],
            url: "",
            thumbnail: "",
            image: "",
          },

          timeoutDM: true,
          timeoutDMMessage: {
            content: "",
            title: "You were timed out!",
            color: "{color}",
            timestamp: true,
            footer: {
              text: "",
              icon: "",
            },
            author: {
              text: "",
              icon: "",
              url: "",
            },
            description:
              "You were timed out on **{server}**.\n**Timed out by:** {moderator}\n**Duration:** {duration}\n**Reason:** {reason}",
            fields: [],
            url: "",
            thumbnail: "",
            image: "",
          },

          kickDM: true,
          kickDMMessage: {
            content: "",
            title: "You were kicked!",
            color: "{color}",
            timestamp: true,
            footer: {
              text: "",
              icon: "",
            },
            author: {
              text: "",
              icon: "",
              url: "",
            },
            description:
              "You were kicked from **{server}**.\n**Kicked by:** {moderator}\n**Reason:** {reason}",
            fields: [],
            url: "",
            thumbnail: "",
            image: "",
          },

          banDM: true,
          banDMMessage: {
            content: "",
            title: "You were banned!",
            color: "{color}",
            timestamp: true,
            footer: {
              text: "",
              icon: "",
            },
            author: {
              text: "",
              icon: "",
              url: "",
            },
            description:
              "You were banned from **{server}**.\n**Banned by:** {moderator}\n**Reason:** {reason}",
            fields: [],
            url: "",
            thumbnail: "",
            image: "",
          },

          tempbanDM: true,
          tempbanDMMessage: {
            content: "",
            title: "You were temporarily banned!",
            color: "{color}",
            timestamp: true,
            footer: {
              text: "",
              icon: "",
            },
            author: {
              text: "",
              icon: "",
              url: "",
            },
            description:
              "You were banned from **{server}**.\n**Banned by:** {moderator}\n**Unban after:** {duration}\n**Reason:** {reason}",
            fields: [],
            url: "",
            thumbnail: "",
            image: "",
          },
        }).save();
    })
      .clone()
      .catch(() => {}));

  client.cache.set(`${guildId}-moderation-config`, moderationConfig);
  return moderationConfig;
};

module.exports = { getModerationConfig };
