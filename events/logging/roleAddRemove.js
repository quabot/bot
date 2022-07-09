const { MessageEmbed, Message } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

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
        if (channel.type === "GUILD_VOICE") return;
        if (channel.type === "GUILD_STAGE_VOICE") return;

        if (logDatabase.enabledEvents.includes("roleAddRemove")) {


            if (oldMember._roles !== newMember._roles) {

                if (oldMember.nickname !== newMember.nickname) return;
                if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
                if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
                if (oldMember.avatar !== newMember.avatar) return;

                let word;
                if (oldMember._roles.length > newMember._roles.length) word = "Removed";
                if (oldMember._roles.length < newMember._roles.length) word = "Given";

                let role;
                if (oldMember._roles < newMember._roles) role = `<@&${newMember._roles.filter(n => !oldMember._roles.includes(n)).join('>\n<@&')}>`;
                if (oldMember._roles > newMember._roles) role = `<@&${oldMember._roles.filter(n => !newMember._roles.includes(n)).join('>\n<@&')}>`;

                if (role === "<@&>") return;

                const embed = new MessageEmbed()
                    .setDescription(`**Roles ${word}**\n${role}`)
                    .setColor(await getColor(newMember.guild.id))
                    .setTimestamp()

                if (newMember.user.avatar) embed.setFooter({ text: `User: ${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL({ dynamic: true })}` })

                channel.send({
                    embeds: [embed]
                }).catch((err => { }));

            }
        }
    }
}