const { EmbedBuilder, Message, Colors } = require('discord.js');
const { logChannelBlackList } = require('../../structures/files/contants');

module.exports = {
    name: "emojiDelete",
    async execute(emoji, client, color) {

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: emoji.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: emoji.guild.id,
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
            const channel = emoji.guild.channels.cache.get(logDatabase.logChannelId);
            if (!channel) return;
            if (logChannelBlackList.includes(channel.type)) return;

            if (!logDatabase.enabledEvents.includes("emojiCreateDelete")) return;
            
            let word = " ";
            if (emoji.animated) word = " Animated ";
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`**Deleted${word}Emoji**\n\`${emoji.name}\``)
                        .setTimestamp()
                        .setFooter({ text: `${emoji.name}`, iconURL: `${emoji.url}` })
                ]
            }).catch((err => { })).catch((err => { }));
    }
}
