const { default: consolaGlobalInstance } = require('consola');
const { Client, EmbedBuilder, Colors, GuildBan, Message } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "messageUpdate",
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {Client} client
     */
    async execute(oldMessage, newMessage, client, color) {

        if (!newMessage.guildId) return;

        const logConfig = await getLogConfig(client, newMessage.guildId);
        if (!logConfig) return;

        const logChannel = await getLogChannel(newMessage.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        const embed = new EmbedBuilder()
            .setDescription(`**Message Edited**\n${newMessage.channel}\n[Jump to Message](${newMessage.url})`)
            .setColor(Colors.Yellow);

        let Oldcontent = String(oldMessage.content);
        let Newcontent = String(newMessage.content);

        if (Oldcontent.content === null || Oldcontent.content === '' && oldMessage.attachments === null && newMessage.attachments === null) { return } else {
            if (Newcontent.content !== null || Newcontent.content !== '') {
                if (Newcontent === Oldcontent) return;
                if (Oldcontent.length > 1020) Oldcontent = Oldcontent.slice(0, 1020);
                try {
                    embed.addFields({ name: "Old Content", value: `${Oldcontent}` });
                } catch (e) { return }
            }
        };

        if (Newcontent.content === null || Newcontent.content === '' && newMessage.attachments === null && oldMessage.attachments === null) { return } else {
            if (Newcontent.content !== null || Newcontent.content !== '') {
                if (Newcontent === 'null' || Newcontent === '') return;
                if (Newcontent === Oldcontent) return;
                if (Newcontent.length > 1020) Newcontent = Newcontent.slice(0, 1020);
                try {
                    embed.addFields({ name: "New Content", value: `${Newcontent}` });
                } catch (e) { return }
            }
        };

        if (newMessage.author === null || newMessage.author === '' || newMessage.author.avatar === null) { } else {
            embed.setFooter({ text: `User: ${newMessage.author.tag}`, iconURL: `${newMessage.author.avatarURL({ dynamic: true })}` })
        }

        if (oldMessage.attachments !== null) {
            oldMessage.attachments.map(getUrls);
            function getUrls(item) {
                embed.addFields({ name: `**Attachments:**`, value: `${[item.url].join(" ")}` });
            }
        }

        logChannel.send({
            embeds: [embed]
        }).catch(() => null);
    }
}