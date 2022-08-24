const { GuildEmoji, Client, EmbedBuilder, Colors } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');
const channelTypes = ["Text channel", "DM", "Voice Channel", "DM", "Category", "News Channels", "News Thread", "Thread", "Private Thread", "Stage Channel", "Directory Channel", "Forum Channel"];

module.exports = {
    event: "emojiCreate",
    name: "emojiCreate",
    /**
     * @param {GuildEmoji} emoji
     * @param {Client} client
     */
    async execute(emoji, client, color) {

        if (!emoji.guild) return;

        const logConfig = await getLogConfig(client, emoji.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(emoji.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        logChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`**New${emoji.animated ? " Animated " : " "}Emoji**\n\`${emoji.name}\``)
                    .setTimestamp()
                    .setFooter({ text: `${emoji.name}`, iconURL: `${emoji.url}` })
            ]
        }).catch((e => { }));
    }
}