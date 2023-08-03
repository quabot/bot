const { Client, Events, Colors, ThreadChannel } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');
const { channelTypesById } = require('../../utils/constants/discord');

module.exports = {
    event: Events.ThreadCreate,
    name: "threadCreate",
    /**
     * @param {ThreadChannel} thread
     * @param {boolean} newlyCreated
     * @param {Client} client 
     */
    async execute(thread, newlyCreated, client) {
		try {
			if (!thread.guild.id) return;
		} catch (e) { }

        const config = await getLoggingConfig(client, thread.guildId);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.events.includes('threadCreate')) return;
        if (thread.parentId && (config.excludedCategories.includes(thread.parent.parentId) || config.excludedChannels.includes(thread.parentId))) return;


        const channel = thread.guild.channels.cache.get(config.channelId);
        if (!channel) return;


        await channel.send({
            embeds: [
                new Embed(Colors.Green)
                    .setDescription(`
                        **${channelTypesById[thread.type]} Created**
                        ${thread.name} - ${thread}
                        **Created by:** <@${thread.ownerId}>
                        
                        `)
            ]
        });
    }
}