const { EmbedBuilder, Message, Colors } = require('discord.js');
const { logChannelBlackList } = require('../../structures/files/contants');

module.exports = {
    name: "threadCreate",
    async execute(thread, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: thread.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: thread.guild.id,
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

        const channel = thread.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (logChannelBlackList.includes(channel.type)) return;

        if (!logDatabase.enabledEvents.includes("threadCreateDelete")) return;

        let word = " ";
        if (thread.type === "GUILD_PUBLIC_THREAD") word = " Public ";
        if (thread.type === "GUILD_PRIVATE_THREAD") word = " Private ";
        if (thread.type === "GUILD_NEWS_THREAD") word = " News ";

        let description = `**New${word}Thread**\n${thread}\n${thread.ownerId ? `<@${thread.ownerId}>` : "None"} - ${thread.parentId ? `<#${thread.parentId}>` : "None"}\n\n**Members:**\n\`${thread.memberCount}\``;

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`${description}`)
                    .setFooter({ text: `${thread.name}` })
                    .setTimestamp()
            ]
        }).catch((err => { }));

    }
}
