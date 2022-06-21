const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "channelUpdate",
    async execute(oldChannel, newChannel, client, color) {
        try {

            console.log(oldChannel)

            // checks for databases and channels
            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldChannel.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldChannel.guild.id,
                        guildName: oldChannel.guild.name,
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

            const channel = oldChannel.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!channel) return;
            if (channel.type === "GUILD_VOICE") return;
            if (channel.type === "GUILD_STAGE_VOICE") return;

            const Log = require('../../structures/schemas/LogSchema');
            const logDatabase = await Log.findOne({
                guildId: oldChannel.guild.id,
            }, (err, log) => {
                if (err) console.error(err);
                if (!log) {
                    const newLog = new Log({
                        guildId: oldChannel.guild.id,
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
            if (!logDatabase.enabled.includes("channelUpdate")) return;


            // prevents console spam
            if (oldChannel.rawPosition !== newChannel.rawPosition && oldChannel.parentId === newChannel.parentId) return;

            // sets channel type var
            let type;
            if (newChannel.type === "GUILD_TEXT") type = "Text Channel";
            if (newChannel.type === "GUILD_VOICE") type = "Voice Channel";
            if (newChannel.type === "GUILD_CATEGORY") type = "Category";
            if (newChannel.type === "GUILD_NEWS") type = "News Channel";
            if (newChannel.type === "GUILD_FORUM") type = "Forum Channel";
            if (newChannel.type === "GUILD_STAGE_VOICE") type = "Stage Channel";
            if (newChannel.type === "GUILD_DIRECTORY") type = "GUILD_DIRECTORY";
            let args = "";

            // actual args
            if (oldChannel.name !== newChannel.name) args = `${args}\n**Name:** \n\`${oldChannel.name}\` -> \`${newChannel.name}\``;
            if (oldChannel.topic !== newChannel.topic) args = `${args}\n**Topic:** \n\`${oldChannel.topic ? `${oldChannel.topic}` : "None"}\` -> \`${newChannel.topic ? `${newChannel.topic}` : "None"}\``;
            if (oldChannel.parentId !== newChannel.parentId) args = `${args}\n**Category:** \n${oldChannel.parentId ? `<#${oldChannel.parentId}>` : "none"} -> ${newChannel.parentId ? `<#${newChannel.parentId}>` : "none"}`;
            if (oldChannel.nsfw !== newChannel.nsfw) args = `${args}\n**NSFW:** \n\`${oldChannel.nsfw ? `Yes` : "No"}\` -> \`${newChannel.nsfw ? `Yes` : "No"}\``;
            if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) args = `${args}\n**Ratelimit:** \n\`${oldChannel.rateLimitPerUser}s\` -> \`${newChannel.rateLimitPerUser}s\``;
            if (oldChannel.rtcRegion !== newChannel.rtcRegion) args = `${args}\n**Region:** \n\`${oldChannel.rtcRegion ? `${oldChannel.rtcRegion}` : "Automatic"}\` -> \`${newChannel.rtcRegion ? `${newChannel.rtcRegion}` : "Automatic"}\``;
            if (oldChannel.bitrate !== newChannel.bitrate) args = `${args}\n**Bitrate:** \n\`${oldChannel.bitrate / 1000}kbps\` -> \`${newChannel.bitrate / 1000}kbps\``;
            if (oldChannel.videoQualityMode !== newChannel.videoQualityMode) return;
            if (oldChannel.userLimit !== newChannel.userLimit) args = `${args}\n**User Limit:** \n\`${oldChannel.userLimit}\` -> \`${newChannel.userLimit}\``
            if (oldChannel.defaultAutoArchiveDuration !== newChannel.threads.defaultAutoArchiveDuration) args = `${args}\n**Auto Archive:** \n\`${oldChannel.defaultAutoArchiveDuration}s\` -> \`${newChannel.defaultAutoArchiveDuration}s\``;
            if (oldChannel.type !== newChannel.type) return;
            if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) return;


            const embed = new MessageEmbed()
                .setColor(color)
                .setDescription(`**${type} Updated**\n${newChannel}\n${args}`)
                .setTimestamp()
                .setFooter({ text: `Channel Name: ${channel.name}` })
            channel.send({ embeds: [embed] }).catch((err => { }));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}