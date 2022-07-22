const { EmbedBuilder, Message } = require('discord.js');
const { logChannelBlackList } = require('../../structures/files/contants');

module.exports = {
    name: "roleDelete",
    async execute(role, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: role.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: role.guild.id,
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

        const channel = role.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (logChannelBlackList.includes(channel.type)) return;

        if (!logDatabase) return;

        let description = `**Role Deleted**\n${role.name}`;
        let perms = role.permissions.toArray().join("\n");

        if (logDatabase.enabledEvents.includes("roleCreateDelete")) {

            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`${role.hexColor}`)
                        .setDescription(`${description}`)
                        .setTimestamp()
                        .setFooter({ text: `Role Name: ${role.name}` })
                ]
            }).catch((err => { }));
        }
    }
}
