const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "inviteCreate",
    async execute(invite, client, color) {
        try {

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: invite.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: invite.guild.id,
                        guildName: invite.guild.name,
                        logChannelID: "none",
                        ticketCategory: "none",
                        ticketClosedCategory: "none",
                        ticketEnabled: true,
                        levelRewards: [],
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
                        funCommands: [
                            '8ball',
                            'brokegamble',
                            'coin',
                            'quiz',
                            'reddit',
                            'rps',
                            'type'
                        ],
                        infoCommands: [
                            'roles',
                            'serverinfo',
                            'userinfo'
                        ],
                        miscCommands: [
                            'avatar',
                            'members',
                            'random',
                            'servericon'
                        ],
                        moderationCommands: [
                            'ban',
                            'clear-punishment',
                            'find-punishment',
                            'kick',
                            'tempban',
                            'timeout',
                            'unban',
                            'untimeout',
                            'warn'
                        ],
                        managementCommands: [
                            'clear',
                            'message',
                            'poll',
                            'reactionroles'
                        ],
                        logsuggestChannelID: "none",
                        funCommands: [
                            '8ball',
                            'brokegamble',
                            'coin',
                            'quiz',
                            'reddit',
                            'rps',
                            'type'
                        ],
                        infoCommands: [
                            'roles',
                            'serverinfo',
                            'userinfo'
                        ],
                        miscCommands: [
                            'avatar',
                            'members',
                            'random',
                            'servericon'
                        ],
                        moderationCommands: [
                            'ban',
                            'clear-punishment',
                            'find-punishment',
                            'kick',
                            'tempban',
                            'timeout',
                            'unban',
                            'untimeout',
                            'warn'
                        ],
                        managementCommands: [
                            'clear',
                            'message',
                            'poll',
                            'reactionroles'
                        ],
                        logPollChannelID: "none",
                        logSuggestChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        leaveChannelID: "none",
                        levelChannelID: "none",
                        funEnabled: true,
                        infoEnabled: true,
                        miscEnabled: true,
                        moderationEnabled: true,
                        managementEnabled: true,
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
            }).clone().catch(function (err) {  });


            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === false) return;

            const channel = invite.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: invite.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: invite.guild.id,
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
            }).clone().catch(function (err) {  });

            if (!logDatabase) return;

            if (!logDatabase.enabled.includes("inviteCreateDelete")) return;

            console.log(`${this.name}`);
            
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**Invite Created**\n[discord.gg/${invite.code}](https://discord.gg/${invite.code})\n${invite.inviter} - ${invite.channel}\n\n**Expires after:**\n${invite.maxAge / 60 / 60} hours`)
                        .setColor(color)
                        .setTimestamp()
                ]
            });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}