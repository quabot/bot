const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "channelUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldChannel, newChannel, client) {

        if (newChannel.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: oldChannel.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: oldChannel.guild.id,
                        guildName: oldChannel.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            });
            const logChannel = oldChannel.guild.channels.cache.get(guildDatabase.logChannelID);
            if (!logChannel) return;
            if (guildDatabase.logEnabled === "false") return;

            if (oldChannel.type === "GUILD_TEXT") {
                if (newChannel.type === "GUILD_NEWS") {
                    const embed = new MessageEmbed()
                        .setTitle("News Channel Updated")
                        .setDescription(`Text Channel ${oldChannel} was turned into a news channel ${newChannel}!`)
                        .setColor(colors.MESSAGE_UPDATED)
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
                    logChannel.send({ embeds: [embed] });
                    return;
                }
                const embed = new MessageEmbed()
                    .setTitle("Text Channel Updated")
                    .setDescription(`${newChannel}`)
                    .setColor(colors.MESSAGE_UPDATED)
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
                logChannel.send({ embeds: [embed] });
            }

            if (oldChannel.type === "GUILD_NEWS") {
                if (newChannel.type === "GUILD_TEXT") {
                    const embed = new MessageEmbed()
                        .setTitle("Text Channel Updated")
                        .setDescription(`${newChannel}`)
                        .setFooter("If this message is empty, it may be that the permissions have changed.")
                        .setColor(colors.MESSAGE_UPDATED)
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
                    logChannel.send({ embeds: [embed] });
                }
                const embed = new MessageEmbed()
                    .setTitle("News Channel Updated")
                    .setFooter("If this message is empty, it may be that the permissions have changed.")
                    .setDescription(`Text Channel ${oldChannel} was turned into a news channel ${newChannel}!`)
                    .setColor(colors.MESSAGE_UPDATED)
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
                logChannel.send({ embeds: [embed] });
                return;
            }

            if (oldChannel.type === "GUILD_VOICE") {
                const embed = new MessageEmbed()
                    .setColor(colors.MESSAGE_UPDATED)
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
                logChannel.send({ embeds: [embed] });
            }

            if (oldChannel.type === "GUILD_STAGE_VOICE") {
                const embed = new MessageEmbed()
                    .setColor(colors.TEXT_CHANNEL_UPDATE)
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
                logChannel.send({ embeds: [embed] });
            }

            if (oldChannel.type === "GUILD_CATEGORY") {
                const embed = new MessageEmbed()
                    .setColor(colors.MESSAGE_UPDATED)
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
                logChannel.send({ embeds: [embed] });
            }
        } catch (e) {
            console.log(e);
            return;
        }

    }
}