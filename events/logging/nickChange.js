const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember, client, color) {
        try {

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldMember.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldMember.guild.id,
                        guildName: oldMember.guild.name,
                        logChannelID: "none",
                        ticketCategory: "none",
                        ticketClosedCategory: "none",
                        ticketEnabled: true,
                        ticketStaffPing: true,
                        ticketTopicButton: true,
                        ticketSupport: "none",
                        ticketId: 1,
                        ticketLogs: true,
                        ticketChannelID: "none",
                        afkStatusAllowed: "true",
                        musicEnabled: "true",
                        musicOneChannelEnabled: "false",
                        musicChannelID: "none",
                        suggestChannelID: "none",
                        logSuggestChannelID: "none",
                        logPollChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        leaveChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        modEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        roleEnabled: false,
                        mainRole: "none",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        membersChannel: "none",
                        membersMessage: "Members: {count}",
                        memberEnabled: true
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === false) return;
            const channel = oldMember.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;
            if (channel.type === "GUILD_VOICE") return;
            if (channel.type === "GUILD_STAGE_VOICE") return;

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: oldMember.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: oldMember.guild.id,
                        enabled: [
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
                        disabled: [
                            'voiceMove',
                            'voiceJoinLeave',
                        ]
                    });
                    newLog.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!logDatabase) return;

            if (logDatabase.enabled.includes("nickChange")) {
                if (oldMember.nickname !== newMember.nickname) {

                    if (oldMember._roles.length !== newMember._roles.length) return;
                    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
                    if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
                    if (oldMember.avatar !== newMember.avatar) return;

                    let oldNick = oldMember.nickname;
                    let newNick = newMember.nickname;
                    if (oldNick === null) oldNick = "none";
                    if (newNick === null) newNick = "none";

                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`**Nickname Changed**\n\`${oldNick}\` -> \`${newNick}\``)
                                .setTimestamp()
                                .setFooter({ text: `User: ${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL({ dynamic: true })}` })
                                .setColor(color)
                        ]
                    }).catch((err => console.log(err)));
                }
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}