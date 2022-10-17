const { Client, EmbedBuilder, Colors, Sticker } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: 'stickerUpdate',
    name: 'stickerUpdate',
    /**
     * @param {Sticker} oldSticker
     * @param {Sticker} newSticker
     * @param {Client} client
     */
    async execute(oldSticker, newSticker, client, color) {
        if (!newSticker.guildId) return;

        const logConfig = await getLogConfig(client, newSticker.guildId);
        if (!logConfig) return;

        const logChannel = await getLogChannel(newSticker.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        let description = '**Sticker Edited**';
        if (oldSticker.name !== newSticker.name)
            description = `${description}\n**Name:**\n\`${oldSticker.name}\` -> \`${newSticker.name}\``;
        if (oldSticker.description !== newSticker.description)
            description = `${description}\n**Description:**\n\`${oldSticker.description}\` -> \`${newSticker.description}\``;
        if (oldSticker.available !== newSticker.available)
            description = `${description}\n**Available:**\n\`${oldSticker.available ? 'Yes' : 'No'}\` -> \`${
                newSticker.available ? 'Yes' : 'No'
            }\``;

        logChannel
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Yellow)
                        .setDescription(`${description}`)
                        .setFooter({ text: `${newSticker.name}` })
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};
