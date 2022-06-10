const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "channelUpdate",
    async execute(oldChannel, newChannel, client, color) {
        try {

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

            if (!logDatabase.
                enabled.includes("channelUpdate")) return;

            if (channel.type === "GUILD_CATEGORY") return;

            const embed = new MessageEmbed()
                .setColor("YELLOW")
                .setTitle("Channel Updated!")
                .setDescription(`${oldChannel}`)
                .setFooter({ text: `ID: ${oldChannel.id}` });

            if (oldChannel.name !== newChannel.name) embed.addFields({ name: "Old Name", value: `${oldChannel.name}`, inline: true }, { name: "New Name", value: `${newChannel.name}`, inline: true }, { name: '\u200b', value: '\u200b', inline: true});
            if (oldChannel.topic !== newChannel.topic) embed.addFields({ name: "Old Topic", value: `${oldChannel.topic}`, inline: true }, { name: "New Topic", value: `${newChannel.topic}`, inline: true }, { name: '\u200b', value: '\u200b', inline: true});
            if (oldChannel.parentId !== newChannel.parentId) embed.addFields({ name: "Old Parent", value: `<#${oldChannel.parentId}>`, inline: true }, { name: "New Parent", value: `<#${newChannel.parentId}>`, inline: true }, { name: '\u200b', value: '\u200b', inline: true});
            if (oldChannel.nsfw !== newChannel.nsfw) embed.addFields({ name: "NSFW", value: `${newChannel.nsfw}`, inline: true }, { name: "\u200b", value: `\u200b`, inline: true }, { name: '\u200b', value: '\u200b', inline: true});
            if (oldChannel.rawPosition !== newChannel.rawPosition) return;
            if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                embed.addField(`Old Slowmode`, `${oldChannel.rateLimitPerUser / 60} minutes`, true)
                embed.addField(`New Slowmode`, `${newChannel.rateLimitPerUser / 60} minutes`, true)
                embed.addField(`\u200b`, `\u200b`, true)
            }

            if (oldChannel.bitrate !== newChannel.bitrate) {
                embed.addField(`Old Bitrate`, `${oldChannel.bitrate} kbps`, true)
                embed.addField(`New Bitrate`, `${newChannel.bitrate} kbps`, true)
                embed.addField(`\u200b`, `\u200b`, true)
            }

            channel.send({ embeds: [embed] }).catch(( err => { } ));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}