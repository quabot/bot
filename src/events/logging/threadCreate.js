const { Client, EmbedBuilder, Colors, Sticker, ThreadChannel, ChannelType } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: 'threadCreate',
    name: 'threadCreate',
    /**
     * @param {ThreadChannel} thread
     * @param {Client} client
     */
    async execute(thread, created, client, color) {
        if (!thread.guildId) return;

        const logConfig = await getLogConfig(client, thread.guild.id);
        if (!logConfig) return;

        if (logConfig.logExcludedChannels && logConfig.logExcludedChannels.includes(thread.parentId)) return;
        if (logConfig.logExcludedCategories && thread.parentId && logConfig.logExcludedCategories.includes(thread.parentId)) return;

        const logChannel = await getLogChannel(thread.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;
        let word;
        if (thread.type === ChannelType.GuildPublicThread) word = ' Public ';
        if (thread.type === ChannelType.GuildPrivateThreadThread) word = ' Private ';
        if (thread.type === ChannelType.GuildNewsThread) word = ' News ';

        let description = `**New${word}Thread**\n${thread}\n${thread.ownerId ? `<@${thread.ownerId}>` : 'None'} - ${
            thread.parentId ? `<#${thread.parentId}>` : 'None'
        }\n\n**Members:**\n\`${thread.memberCount}\``;

        logChannel
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setDescription(`${description}`)
                        .setFooter({ text: `${thread.name}` })
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};
