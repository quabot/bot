const { MessageEmbed, Message } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState, newState, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: newState.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: newState.guild.id,
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

        const channel = newState.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (channel.type === "GUILD_VOICE") return;
        if (channel.type === "GUILD_STAGE_VOICE") return;

        if (!logDatabase) return;

        if (!logDatabase.enabledEvents.includes("voiceMove")) return;

        if (!oldState.channelId) return;
        if (!newState.channelId) return;

        const user = newState.guild.members.cache.get(`${newState.id}`);
        if (!user) return;

        const embed = new MessageEmbed()
            .setColor(await getColor(newState.guild.id))
            .setDescription(`**${user} switched from <#${oldState.channelId}> to <#${newState.channelId}>**`)
            .setTimestamp()

        if (user.user.avatar) embed.setFooter({ text: `User: ${user.user.tag}`, iconURL: `${user.user.avatarURL({ dynamic: true })}` })


        channel.send({
            embeds: [embed]
        }).catch((err => { }));

    }
}