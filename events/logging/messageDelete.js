const { EmbedBuilder, Message } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "messageDelete",
    async execute(message, client, color) {

        if (!message) return;

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: message.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: message.guild.id,
                    logChannelId: "none",
                    logEnabled: true,
                    enabledEvents: [
                        'emojiCreateDelete',
                        'emojiUpdate',
                        'guildBanAdd',
                        'guildBanRemove',
                        'roleAddRemove',
                        'nickChange',
                        'channelCreateDelete',
                        'channelUpdate',
                        'inviteCreateDelete',
                        'messageDelete',
                        'messageUpdate',
                        'roleCreateDelete',
                        'roleUpdate',
                        'stickerCreateDelete',
                        'stickerUpdate',
                        'threadCreateDelete',
                    ],
                    disabledEvents: [
                        'voiceMove',
                        'voiceJoinLeave',
                    ]
                });
                newLog.save()
                    .catch(err => {
                        console.log(err);
                    });
            }
        }).clone().catch(function (err) { });

        if (!logDatabase) return;
        if (logDatabase.logEnabled === false) return;

        const channel = message.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (channel.type === "GUILD_VOICE") return;
        if (channel.type === "GUILD_STAGE_VOICE") return;

        if (!logDatabase) return;

        if (!logDatabase.enabledEvents.includes("messageDelete")) return;

        if (message.content === null && message.attachments === null) return;
        if (message.content === '' && message.attachments === null) return;
        if (!message.content && !message.attachments) return;

        let description = "**Message Deleted**";

        let content = String(message.content);

        if (content === null) content = "";

        if (content.length > 1003) return;

        description = `${description}\n${content}`;

        const embed = new EmbedBuilder()
            .setDescription(`${description}`)
            .setColor(await getColor(message.guild.id));

        if (message.author.avatar) embed.setFooter({ text: `User: ${message.author.tag}`, iconURL: `${message.author.avatarURL({ dynamic: true })}` })

        embed.addField("Channel", `${message.channel}`, true);

        if (message.attachments !== null) {
            message.attachments.map(getUrls);
            function getUrls(item) {
                embed.addField(`**Attachment:**`, `${[item.url].join(" ")}`)
            }
        }

        channel.send({ embeds: [embed] }).catch((err => { }));

    }
}