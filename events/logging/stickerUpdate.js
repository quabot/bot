const { MessageEmbed, Message } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "stickerUpdate",
    async execute(oldSticker, newSticker, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: newSticker.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: newSticker.guild.id,
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

        const channel = newSticker.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (channel.type === "GUILD_VOICE") return;
        if (channel.type === "GUILD_STAGE_VOICE") return;

        if (!logDatabase.enabledEvents.includes("stickerUpdate")) return;

        let description = "**Sticker Edited**";
        if (oldSticker.name !== newSticker.name) description = `${description}\n\n**Name:**\n\`${oldSticker.name}\` -> \`${newSticker.name}\``
        if (oldSticker.description !== newSticker.description) description = `${description}\n\n**Description:**\n\`${oldSticker.description}\` -> \`${newSticker.description}\``
        if (oldSticker.available !== newSticker.available) description = `${description}\n\n**Available:**\n\`${oldSticker.available ? "Yes" : "No"}\` -> \`${newSticker.available ? "Yes" : "No"}\``

        channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(await getColor(newSticker.guild.id))
                    .setDescription(`${description}`)
                    .setFooter({ text: `${newSticker.name}` })
                    .setTimestamp()
            ]
        }).catch((err => { }));

    }
}