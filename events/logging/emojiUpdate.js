const { EmbedBuilder, Message } = require('discord.js');

module.exports = {
    name: "emojiUpdate",
    async execute(oldEmoji, newEmoji, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: newEmoji.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: newEmoji.guild.id,
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

        const channel = oldEmoji.guild.channels.cache.get(logDatabase.logChannelId);

        if (!channel) return;
        if (channel.type === "GUILD_VOICE") return;
        if (channel.type === "GUILD_STAGE_VOICE") return;

        if (!logDatabase.enabledEvents.includes("emojiUpdate")) return;

        let word = "";
        if (newEmoji.animated) word = " Animated ";
        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("YELLOW")
                    .setDescription(`**${word}Emoji edited**\n\`${oldEmoji.name}\` -> \`${newEmoji.name}\``)
                    .setFooter({ text: `${newEmoji.name}`, iconURL: `${newEmoji.url}` })
                    .setTimestamp()
            ]
        });

    }
}