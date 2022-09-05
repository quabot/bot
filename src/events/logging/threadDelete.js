const { Client, EmbedBuilder, Colors, Sticker, ThreadChannel, ChannelType } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "threadDelete",
    name: "threadDelete",
    /**
     * @param {ThreadChannel} thread
     * @param {Client} client
     */
    async execute(thread, client, color) {

        if (!thread.guildId) return;

        const logConfig = await getLogConfig(client, thread.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(thread.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;
        let word;
        if (thread.type === ChannelType.GuildPublicThread) word = "Public ";
        if (thread.type === ChannelType.GuildPrivateThreadThread) word = "Private ";
        if (thread.type === ChannelType.GuildNewsThread) word = "News ";

        let description = `**${word}Thread Deleted**\n${thread.name}\n${thread.ownerId ? `<@${thread.ownerId}>` : "None"} - ${thread.parentId ? `<#${thread.parentId}>` : "None"}\n\n**Members:**\n\`${thread.memberCount}\``;


        logChannel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${description}`)
                .setFooter({ text: `${thread.name}` })
                .setTimestamp()
            ]
        }).catch((err => { }));
    }
}