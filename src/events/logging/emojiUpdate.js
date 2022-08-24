const { GuildEmoji, Client, EmbedBuilder, Colors } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');
const channelTypes = ["Text channel", "DM", "Voice Channel", "DM", "Category", "News Channels", "News Thread", "Thread", "Private Thread", "Stage Channel", "Directory Channel", "Forum Channel"];

module.exports = {
    event: "emojiUpdate",
    name: "emojiUpdate",
    /**
     * @param {GuildEmoji} oldEmoji
     * @param {GuildEmoji} newEmoji
     * @param {Client} client
     */
    async execute(oldEmoji, newEmoji, client, color) {

        if (!newEmoji.guild) return;

        const logConfig = await getLogConfig(client, newEmoji.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(newEmoji.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        logChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${newEmoji.animated ? "Animated " : ""}Emoji Edited**\n\`${oldEmoji.name}\` -> \`${newEmoji.name}\``)
                    .setFooter({ text: `${newEmoji.name}`, iconURL: `${newEmoji.url}` })
                    .setColor(Colors.Yellow)
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}