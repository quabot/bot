const { GuildChannel, Client, EmbedBuilder, Colors } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');
const channelTypes = ["Text channel", "DM", "Voice Channel", "DM", "Category", "News Channels", "News Thread", "Thread", "Private Thread", "Stage Channel", "Directory Channel", "Forum Channel"];

module.exports = {
    event: "channelUpdate",
    name: "channelUpdate",
    /**
     * @param {GuildChannel} oldChannel
     * @param {GuildChannel} newChannel
     * @param {Client} client
     */
    async execute(oldChannel, newChannel, client, color) {

        if (!newChannel.guildId) return;

        const logConfig = await getLogConfig(client, newChannel.guildId);
        if (!logConfig) return;

        const logChannel = await getLogChannel(newChannel.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;
        
        console.log(newChannel, oldChannel)
        let args = "";
        if (oldChannel.rawPosition !== newChannel.rawPosition) return;
        if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) return;
        if (oldChannel.videoQualityMode !== newChannel.videoQualityMode) return;
        if (oldChannel.type !== newChannel.type) args = args.concat('\n', `**Type:**\n\`${channelTypes[oldChannel.type]} -> ${channelTypes[newChannel.type]}\``);
        if (oldChannel.name !== newChannel.name) args = args.concat('\n', `**Name:** \n\`${oldChannel.name}\` -> \`${newChannel.name}\``);
        if (oldChannel.topic !== newChannel.topic) args = args.concat('\n', `**Description:** \n\`${oldChannel.topic ? `${oldChannel.topic}` : "None"}\` -> \`${newChannel.topic ? `${newChannel.topic}` : "None"}\``);
        if (oldChannel.parentId !== newChannel.parentId) args = args.concat('\n', `**Category:** \n${oldChannel.parentId ? `<#${oldChannel.parentId}>` : "none"} -> ${newChannel.parentId ? `<#${newChannel.parentId}>` : "none"}`);
        if (oldChannel.nsfw !== newChannel.nsfw) args = args.concat('\n', `**NSFW:** \n\`${oldChannel.nsfw ? `Yes` : "No"}\` -> \`${newChannel.nsfw ? `Yes` : "No"}\``);
        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) args = args.concat('\n', `**Ratelimit:** \n\`${oldChannel.rateLimitPerUser}s\` -> \`${newChannel.rateLimitPerUser}s\``);
        if (oldChannel.rtcRegion !== newChannel.rtcRegion) args = args.concat('\n', `**Region:** \n\`${oldChannel.rtcRegion ? `${oldChannel.rtcRegion}` : "Automatic"}\` -> \`${newChannel.rtcRegion ? `${newChannel.rtcRegion}` : "Automatic"}\``);
        if (oldChannel.bitrate !== newChannel.bitrate) args = args.concat('\n', `**Bitrate:** \n\`${oldChannel.bitrate / 1000}kbps\` -> \`${newChannel.bitrate / 1000}kbps\``);
        if (oldChannel.userLimit !== newChannel.userLimit) args = args.concat('\n', `**User Limit:** \n\`${oldChannel.userLimit}\` -> \`${newChannel.userLimit}\``)
        if (oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration) args = args.concat('\n', `**Auto Archive:** \n\`${oldChannel.defaultAutoArchiveDuration}s\` -> \`${newChannel.defaultAutoArchiveDuration}s\``);

        logChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setDescription(`**${channelTypes[newChannel.type]} Updated**\n${newChannel}\n${args}`)
                    .setTimestamp()
                    .setFooter({ text: `Channel Name: ${newChannel.name}` })
            ]
        }).catch((e => { }));
    }
}