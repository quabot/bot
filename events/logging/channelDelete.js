const { EmbedBuilder } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "channelDelete",
    async execute(channel, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: channel.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: channel.guild.id,
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
        const sendCh = channel.guild.channels.cache.get(logDatabase.logChannelId);
        if (!sendCh) return;

        if (!logDatabase.enabledEvents.includes("channelCreateDelete")) return;

        let title;
        if (channel.type === "GUILD_TEXT") title = "Text Channel";
        if (channel.type === "GUILD_VOICE") title = "Voice Channel";
        if (channel.type === "GUILD_CATEGORY") title = "Category";
        if (channel.type === "GUILD_NEWS") title = "News Channel";
        if (channel.type === "GUILD_FORUM") title = "Forum Channel";
        if (channel.type === "GUILD_STAGE_VOICE") title = "Stage Channel";
        if (channel.type === "GUILD_DIRECTORY") title = "GUILD_DIRECTORY";

        sendCh.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(await getColor(channel.guild.id))
                    .setDescription(`**${title} Deleted**\n\`${channel.name}\``)
                    .setTimestamp()
            ]
        });

    }
}