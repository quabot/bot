const { EmbedBuilder, Message } = require('discord.js');
const { getColor, logChannelBlackList } = require('../../structures/files/contants');

module.exports = {
    name: "inviteCreate",
    async execute(invite, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: invite.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: invite.guild.id,
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

        const channel = invite.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (logChannelBlackList.includes(channel.type)) return;

        if (!logDatabase.enabledEvents.includes("inviteCreateDelete")) return;

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Invite Created**\n[discord.gg/${invite.code}](https://discord.gg/${invite.code})\n${invite.inviter} - ${invite.channel}\n\n**Expires after:**\n${invite.maxAge / 60 / 60} hours`)
                    .setColor(await getColor(invite.guild.id))
                    .setTimestamp()
            ]
        }).catch((err => { }));

    }
}
