const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage, client, color) {
        try {


            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldMessage.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldMessage.guild.id,
                        guildName: oldMessage.guild.name,
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

            if (!newMessage.author) return;
            if (newMessage.author.bot) return;
            if (!guildDatabase) return;
            if (guildDatabase.logEnabled === false) return;

            const channel = oldMessage.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;
            if (channel.type === "GUILD_VOICE") return;
            if (channel.type === "GUILD_STAGE_VOICE") return;

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: oldMessage.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: oldMessage.guild.id,
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

            if (!logDatabase.enabled.includes("messageUpdate")) return;

            console.log(`${this.name}`);
            
            const embed = new MessageEmbed()
                .setDescription(`**Message Edited**\n${newMessage.channel}`)
                .setColor(color);

            let Oldcontent = String(oldMessage.content);
            let Newcontent = String(newMessage.content);

            if (Oldcontent.length > 1020) return;
            if (Newcontent.length > 1020) return;

            if (Oldcontent.content === null || Oldcontent.content === '' && oldMessage.attachments === null && oldMessage.attachments === null) { return } else {
                if (Newcontent.content !== null || Newcontent.content !== '') {
                    if (Oldcontent === 'null' || Oldcontent === '') return;
                    if (Newcontent === Oldcontent) return;
                    embed.addField("Old Content", `${Oldcontent}`)
                }
            };


            if (Newcontent.content === null || Newcontent.content === '' && newMessage.attachments === null && oldMessage.attachments === null) { return } else {
                if (Newcontent.content !== null || Newcontent.content !== '') {
                    if (Newcontent === 'null' || Newcontent === '') return;
                    if (Newcontent === Oldcontent) return;
                    embed.addField("New Content", `${Newcontent}`)
                }
            };

            if (newMessage.author === null || newMessage.author === '' || newMessage.author.avatar === null) { } else {
                embed.setFooter({ text: `User: ${newMessage.author.tag}`, iconURL: `${newMessage.author.avatarURL({ dynamic: true })}` })
            }

            if (oldMessage.attachments !== null) {
                oldMessage.attachments.map(getUrls);
                function getUrls(item) {
                    embed.addField(`**Attachments:**`, `${[item.url].join(" ")}`)
                }
            }

            channel.send({ embeds: [embed] }).catch((err => console.log(err)));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}