const { Client, EmbedBuilder, Colors, Sticker } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "stickerDelete",
    name: "stickerDelete",
    /**
     * @param {Sticker} sticker
     * @param {Client} client
     */
    async execute(sticker, client, color) {

        if (!sticker.guildId) return;

        const logConfig = await getLogConfig(client, sticker.guildId);
        if (!logConfig) return;

        const logChannel = await getLogChannel(sticker.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        logChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`**Sticker Deleted**\n\`${sticker.name}\`\n${sticker.description}`)
                    .setTimestamp()
                    .setFooter({ text: `${sticker.name}`, iconURL: `${sticker.url}` })
            ]
        }).catch(() => null);
    }
}