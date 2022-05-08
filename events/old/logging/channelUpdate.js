const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "channelUpdate",
    async execute(oldChannel, newChannel, client) {

        if (newChannel.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: newChannel.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: newChannel.guild.id,
                        guildName: newChannel.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: newChannel.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: newChannel.guild.id,
                        guildName: newChannel.guild.name,
                        joinMessages: true,
                        leaveMessages: true,
                        channelCreateDelete: true,
                        channelUpdate: true,
                        emojiCreateDelete: true,
                        emojiUpdate: true,
                        inviteCreateDelete: true,
                        messageDelete: true,
                        messageUpdate: true,
                        roleCreateDelete: true,
                        roleUpdate: true,
                        voiceState: false,
                        voiceMove: false,
                        memberUpdate: true,
                        quabotLogging: true
                    })
                    newEvents.save().catch(err => {
                        console.log(err)
                        interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                    })
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }
            ).clone().catch(function (err) { console.log(err) });


            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = newChannel.guild.channels.cache.get(guildDatabase.logChannelID);

            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;
            if (eventsDatabase.channelUpdate === false) return;


            if (oldChannel.type === "GUILD_TEXT") {
                if (newChannel.type === "GUILD_NEWS") {
                    const embed = new MessageEmbed()
                        .setTitle("News Channel Updated")
                        .setDescription(`Text Channel ${oldChannel} was turned into a news channel ${newChannel}!`)
                        .setColor(`YELLOW`)
                        .setFooter("If this message is empty, it may be that the permissions have changed.")
                    if (oldChannel.name !== newChannel.name) {
                        embed.addField(`Old Name`, `${oldChannel.name}`, true)
                        embed.addField(`New Name`, `${newChannel.name}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    embed.addField(`Channel-ID`, `${newChannel.id}`)
                    if (oldChannel.topic !== newChannel.topic) {
                        embed.addField(`Old Topic`, `${oldChannel.topic}`, true)
                        embed.addField(`New Topic`, `${newChannel.topic}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    if (oldChannel.nsfw !== newChannel.nsfw) {
                        embed.addField(`NSFW`, `${newChannel.nsfw}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    if (oldChannel.parentId !== newChannel.parentId) {
                        embed.addField(`Old Parent`, `${oldChannel.parentId}`, true)
                        embed.addField(`New Parent`, `${newChannel.parentId}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    if (oldChannel.rawPosition !== newChannel.rawPosition) {
                        return;
                    }
                    logChannel.send({ embeds: [embed] }).catch(err => console.log('error'));
                    return;
                }
                const embed = new MessageEmbed()
                    .setTitle("Text Channel Updated")
                    .setDescription(`${newChannel}`)
                    .setColor(COLOR_MAIN)
                if (oldChannel.name !== newChannel.name) {
                    embed.addField(`Old Name`, `${oldChannel.name}`, true)
                    embed.addField(`New Name`, `${newChannel.name}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                embed.setFooter(`Channel-ID`, `${newChannel.id}`)
                if (oldChannel.topic !== newChannel.topic) {
                    embed.addField(`Old Topic`, `${oldChannel.topic}`, true)
                    embed.addField(`New Topic`, `${newChannel.topic}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.nsfw !== newChannel.nsfw) {
                    embed.addField(`NSFW`, `${newChannel.nsfw}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.parentId !== newChannel.parentId) {
                    embed.addField(`Old Parent`, `${oldChannel.parentId}`, true)
                    embed.addField(`New Parent`, `${newChannel.parentId}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.rawPosition !== newChannel.rawPosition) {
                    return;
                }
                if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                    embed.addField(`Old Slowmode`, `${oldChannel.rateLimitPerUser / 60} minutes`, true)
                    embed.addField(`New Slowmode`, `${newChannel.rateLimitPerUser / 60} minuts`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                logChannel.send({ embeds: [embed] }).catch(err => console.log('error'));
            }

            if (oldChannel.type === "GUILD_NEWS") {
                if (newChannel.type === "GUILD_TEXT") {
                    const embed = new MessageEmbed()
                        .setTitle("Text Channel Updated")
                        .setDescription(`${newChannel}`)
                        .setFooter("If this message is empty, it may be that the permissions have changed.")
                        .setColor(COLOR_MAIN)
                    if (oldChannel.name !== newChannel.name) {
                        embed.addField(`Old Name`, `${oldChannel.name}`, true)
                        embed.addField(`New Name`, `${newChannel.name}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    embed.addField(`Channel-ID`, `${newChannel.id}`)
                    if (oldChannel.topic !== newChannel.topic) {
                        embed.addField(`Old Topic`, `${oldChannel.topic}`, true)
                        embed.addField(`New Topic`, `${newChannel.topic}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    if (oldChannel.nsfw !== newChannel.nsfw) {
                        embed.addField(`NSFW`, `${newChannel.nsfw}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    if (oldChannel.parentId !== newChannel.parentId) {
                        embed.addField(`Old Parent`, `${oldChannel.parentId}`, true)
                        embed.addField(`New Parent`, `${newChannel.parentId}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    if (oldChannel.rawPosition !== newChannel.rawPosition) {
                        return;
                    }
                    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                        embed.addField(`Old Slowmode`, `${oldChannel.rateLimitPerUser}`, true)
                        embed.addField(`New Slowmode`, `${newChannel.rateLimitPerUser}`, true)
                        embed.addField(`**  **`, `**  **`, true)
                    }
                    logChannel.send({ embeds: [embed] }).catch(err => console.log('error'));
                }
                const embed = new MessageEmbed()
                    .setTitle("News Channel Updated")
                    .setFooter("If this message is empty, it may be that the permissions have changed.")
                    .setDescription(`Text Channel ${oldChannel} was turned into a news channel ${newChannel}!`)
                    .setColor(COLOR_MAIN)
                if (oldChannel.name !== newChannel.name) {
                    embed.addField(`Old Name`, `${oldChannel.name}`, true)
                    embed.addField(`New Name`, `${newChannel.name}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                embed.addField(`Channel-ID`, `${newChannel.id}`)
                if (oldChannel.topic !== newChannel.topic) {
                    embed.addField(`Old Topic`, `${oldChannel.topic}`, true)
                    embed.addField(`New Topic`, `${newChannel.topic}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.nsfw !== newChannel.nsfw) {
                    embed.addField(`NSFW`, `${newChannel.nsfw}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.parentId !== newChannel.parentId) {
                    embed.addField(`Old Parent`, `${oldChannel.parentId}`, true)
                    embed.addField(`New Parent`, `${newChannel.parentId}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.rawPosition !== newChannel.rawPosition) {
                    return;
                }
                logChannel.send({ embeds: [embed] }).catch(err => console.log('error'));
                return;
            }

            if (oldChannel.type === "GUILD_VOICE") {
                const embed = new MessageEmbed()
                    .setColor(COLOR_MAIN)
                    .setTitle("Voice Channel Updated")
                    .setFooter("If this message is empty, it may be that the permissions have changed.")
                    .setDescription(`${newChannel}`)
                if (oldChannel.name !== newChannel.name) {
                    embed.addField(`Old Name`, `${oldChannel.name}`, true)
                    embed.addField(`New Name`, `${newChannel.name}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                embed.addField(`Channel-ID`, `${newChannel.id}`)
                if (oldChannel.parentId !== newChannel.parentId) {
                    embed.addField(`Old Parent`, `<#${oldChannel.parentId}>`, true)
                    embed.addField(`New Parent`, `<#${newChannel.parentId}>`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.rawPosition !== newChannel.rawPosition) {
                    return;
                }
                if (oldChannel.bitrate !== newChannel.bitrate) {
                    embed.addField(`Old Bitrate`, `${oldChannel.bitrate / 1000}kbps`, true)
                    embed.addField(`New Bitrate`, `${newChannel.bitrate / 1000}kbps`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                logChannel.send({ embeds: [embed] }).catch(err => console.log('error'));
            }

            if (oldChannel.type === "GUILD_STAGE_VOICE") {
                const embed = new MessageEmbed()
                    .setColor(COLOR_MAIN)
                    .setTitle("Voice Channel Updated")
                    .setFooter("If this message is empty, it may be that the permissions have changed.")
                    .setDescription(`${newChannel}`)
                if (oldChannel.name !== newChannel.name) {
                    embed.addField(`Old Name`, `${oldChannel.name}`, true)
                    embed.addField(`New Name`, `${newChannel.name}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                embed.addField(`Channel-ID`, `${newChannel.id}`)
                if (oldChannel.parentId !== newChannel.parentId) {
                    embed.addField(`Old Parent`, `<#${oldChannel.parentId}>`, true)
                    embed.addField(`New Parent`, `<#${newChannel.parentId}>`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.rawPosition !== newChannel.rawPosition) {
                    return;
                }
                if (oldChannel.bitrate !== newChannel.bitrate) {
                    embed.addField(`Old Bitrate`, `${oldChannel.bitrate / 1000}kbps`, true)
                    embed.addField(`New Bitrate`, `${newChannel.bitrate / 1000}kbps`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                logChannel.send({ embeds: [embed] }).catch(err => console.log('error'));
            }

            if (oldChannel.type === "GUILD_CATEGORY") {
                const embed = new MessageEmbed()
                    .setColor(COLOR_MAIN)
                    .setFooter("If this message is empty, it may be that the permissions have changed.")
                    .setTitle("Category Updated")
                    .setDescription(`${newChannel}`)
                if (oldChannel.name !== newChannel.name) {
                    embed.addField(`Old Name`, `${oldChannel.name}`, true)
                    embed.addField(`New Name`, `${newChannel.name}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                embed.addField(`Channel-ID`, `${newChannel.id}`)
                if (oldChannel.parentId !== newChannel.parentId) {
                    embed.addField(`Old Parent`, `<#${oldChannel.parentId}>`, true)
                    embed.addField(`New Parent`, `<#${newChannel.parentId}>`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.rawPosition !== newChannel.rawPosition) {
                    return;
                }
                logChannel.send({ embeds: [embed] }).catch(err => console.log('error'));
            }
        } catch (e) {
            console.log(e)
            return;
        }
    }
}