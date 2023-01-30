const { Client, Events, Colors, ThreadChannel } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');
const { channelTypesById } = require('../../utils/constants/discord');

module.exports = {
    event: Events.ThreadDelete,
    name: "threadDelete",
    /**
     * @param {ThreadChannel} thread
     * @param {boolean} newlyCreated
     * @param {Client} client 
     */
    async execute(thread, client) {
        const config = await getLoggingConfig(client, thread.guildId);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.enabledEvents.includes('threadDelete')) return;
        if (thread.parentId && (config.excludedCategories.includes(thread.parent.parentId) || config.excludedChannels.includes(thread.parentId))) return;


        const channel = thread.guild.channels.cache.get(config.channelId);
        if (!channel) return;


        await channel.send({
            embeds: [
                new Embed(Colors.Red)
                    .setDescription(`
                        **${channelTypesById[thread.type]} Deleted**
                        ${thread.name} - Parent: ${thread.parent}
                        **Created by:** <@${thread.ownerId}>
                        
                        `)
            ]
        });
    }
}