const { Client, Events, Colors, GuildChannel } = require("discord.js");
const { getLoggingConfig } = require("@configs/loggingConfig");
const { channelTypesById } = require("@constants/discord");
const { Embed } = require("@constants/embed");

module.exports = {
  event: Events.ChannelUpdate,
  name: "channelUpdate",
  /**
   * @param {GuildChannel} oldChannel
   * @param {GuildChannel} newChannel
   * @param {Client} client
   */
  async execute(oldChannel, newChannel, client) {
    if (!newChannel.guildId) return;

    const config = await getLoggingConfig(client, newChannel.guildId);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes("channelUpdate")) return;
    if (
      newChannel.parentId &&
      config.excludedCategories.includes(newChannel.parentId)
    )
      return;
    if (config.excludedChannels.includes(newChannel.id)) return;

    const channel = newChannel.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    let description = "";
    if (oldChannel.rawPosition !== newChannel.rawPosition) return;
    if (oldChannel.type !== newChannel.type)
      description += `\n**Type:**\n\`${
        channelTypesById[oldChannel.type]
      }\` -> \`${channelTypesById[newChannel.type]}\``;
    if (oldChannel.name !== newChannel.name)
      description += `\n**Name:** \n\`${oldChannel.name}\` -> \`${newChannel.name}\``;
    if (oldChannel.topic !== newChannel.topic)
      description += `\n**Description:** \n\`${
        oldChannel.topic ? `${oldChannel.topic}` : "None"
      }\` -> \`${newChannel.topic ? `${newChannel.topic}` : "None"}\``;
    if (oldChannel.parentId !== newChannel.parentId)
      description += `\n**Category:** \n${
        oldChannel.parentId ? `<#${oldChannel.parentId}>` : "none"
      } -> ${newChannel.parentId ? `<#${newChannel.parentId}>` : "none"}`;
    if (oldChannel.nsfw !== newChannel.nsfw)
      description += `\n**NSFW:** \n\`${
        oldChannel.nsfw ? "Yes" : "No"
      }\` -> \`${newChannel.nsfw ? "Yes" : "No"}\``;
    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser)
      description += `\n**Ratelimit:** \n\`${oldChannel.rateLimitPerUser}s\` -> \`${newChannel.rateLimitPerUser}s\``;
    if (oldChannel.rtcRegion !== newChannel.rtcRegion)
      description += `\n**Region:** \n\`${
        oldChannel.rtcRegion ? `${oldChannel.rtcRegion}` : "Automatic"
      }\` -> \`${
        newChannel.rtcRegion ? `${newChannel.rtcRegion}` : "Automatic"
      }\``;
    if (oldChannel.bitrate !== newChannel.bitrate)
      description += `\n**Bitrate:** \n\`${
        oldChannel.bitrate / 1000
      }kbps\` -> \`${newChannel.bitrate / 1000}kbps\``;
    if (oldChannel.userLimit !== newChannel.userLimit)
      description += `\n**User Limit:** \n\`${oldChannel.userLimit}\` -> \`${newChannel.userLimit}\``;
    if (
      oldChannel.defaultAutoArchiveDuration !==
      newChannel.defaultAutoArchiveDuration
    )
      description += `\n**Auto Archive:** \n\`${oldChannel.defaultAutoArchiveDuration}s\` -> \`${newChannel.defaultAutoArchiveDuration}s\``;

    if (description === "") return;
    await channel.send({
      embeds: [
        new Embed(Colors.Yellow).setDescription(`
                        **${channelTypesById[newChannel.type]} Channel Edited**
                        ${channel}
                        ${description}
                        `),
      ],
    });
  },
};
