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

            if (logDatabase.enabled.includes("roleAddRemove")) {
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

                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`**Roles ${word}**\n${role}`)
                                .setColor(color)
                                .setTimestamp()
                                .setFooter({ text: `User: ${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL({ dynamic: true })}` })

                        ]
                    }).catch((err => { }));

                }
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}