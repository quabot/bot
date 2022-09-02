const { Client, EmbedBuilder, Colors, GuildBan, Message } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "messageDelete",
    name: "messageDelete",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client, color) {
        try {

            if (!message.guildId) return;

            const logConfig = await getLogConfig(client, message.guildId);
            if (!logConfig) return;

            const logChannel = await getLogChannel(message.guild, logConfig);
            if (!logChannel) return;

            if (!logConfig.enabledEvents.includes(this.event)) return;

            let description = "**Message Deleted**";

            let content = String(message.content);
            if (content === null) return;
            if (content.length === 0) return;
            if (content.length > 1003) content = content.slice(0, 1002);

            description = `${description}\n${content}`;

            const embed = new EmbedBuilder()
                .setDescription(`${description}`)
                .setColor(Colors.Red);
            if (message.author.avatar) embed.setFooter({ text: `User: ${message.author.tag}`, iconURL: `${message.author.avatarURL({ dynamic: true })}` })

            embed.addFields({ name: "Channel", value: `${message.channel}`, inline: true });
            if (message.attachments !== null) {
                message.attachments.map(getUrls);
                function getUrls(item) {
                    embed.addFields({ name: `**Attachment:**`, value: `${[item.url].join(" ")}` })
                }
            }

            logChannel.send({
                embeds: [embed]
            }).catch(() => null);

        } catch (e) { }
    }
}