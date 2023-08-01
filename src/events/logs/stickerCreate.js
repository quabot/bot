const { Client, Events, Sticker, Colors } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.GuildStickerCreate,
    name: "stickerCreate",
    /**
     * @param {Sticker} sticker
     * @param {Client} client 
     */
    async execute(sticker, client) {
		try {
			if (sticker.guild.id) return;
		} catch (e) { }

        const config = await getLoggingConfig(client, sticker.guild.id);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.events.includes('stickerCreate')) return;


        const channel = sticker.guild.channels.cache.get(config.channelId);
        if (!channel) return;


        await channel.send({
            embeds: [
                new Embed(Colors.Green)
                    .setDescription(`
                        **Sticker Created**
                        ${sticker.name} - [Full image](${sticker.url})
                        ${sticker.description}
                        `)
                    .setFooter({ text: `${sticker.name}`, iconURL: `${sticker.url}` })
            ]
        });
    }
}