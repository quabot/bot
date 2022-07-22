const { EmbedBuilder, Message } = require('discord.js');
const { getColor, logChannelBlackList } = require('../../structures/files/contants');

module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember, client, color) {

        const Log = require('../../structures/schemas/LogSchema');
        const logDatabase = await Log.findOne({
            guildId: newMember.guild.id,
        }, (err, log) => {
            if (err) console.error(err);
            if (!log) {
                const newLog = new Log({
                    guildId: newMember.guild.id,
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
        const channel = oldMember.guild.channels.cache.get(logDatabase.logChannelId);
        if (!channel) return;
        if (logChannelBlackList.includes(channel.type)) return;

        if (logDatabase.enabledEvents.includes("nickChange")) {

            if (oldMember.nickname !== newMember.nickname) {

                if (oldMember._roles.length !== newMember._roles.length) return;
                if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
                if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
                if (oldMember.avatar !== newMember.avatar) return;

                let oldNick = oldMember.nickname;
                let newNick = newMember.nickname;
                if (oldNick === null) oldNick = "none";
                if (newNick === null) newNick = "none";

                const embed = new EmbedBuilder()
                    .setDescription(`**Nickname Changed**\n\`${oldNick}\` -> \`${newNick}\``)
                    .setTimestamp()
                    .setColor(await getColor(oldMember.guild.id))

                if (newMember.user.avatar) embed.setFooter({ text: `User: ${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL({ dynamic: true })}` });

                channel.send({
                    embeds: [embed]
                }).catch((err => console.log(err)));
            }
        }
    }
}
