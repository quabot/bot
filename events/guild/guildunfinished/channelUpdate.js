const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "channelUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldChannel, newChannel, client) {

        const settings = await Guild.findOne({
            guildID: newChannel.guild.id
        }, (err, guild) => {
            if (err) return;
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: newChannel.guild.id,
                    guildName: newChannel.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: "none",
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: "none",
                    suggestEnabled: true,
                    suggestChannelID: "none",
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: "none",
                    enableNSFWContent: false,
                });

                newGuild.save()
                    .catch(err => console.log(err));

                return;
            }
        });
        const logChannel = newChannel.guild.channels.cache.get(settings.logChannelID);
        console.log(oldChannel)

        if (oldChannel.type === "GUILD_TEXT") {
            if (newChannel.type === "GUILD_NEWS") {
                const embed = new MessageEmbed()
                    .setTitle("News Channel Updated")
                    .setDescription(`Text Channel ${oldChannel} was turned into a news channel ${newChannel}!`)
                    .setColor(colors.TEXT_TO_NEWS_CHANNEL_UPDATE)
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
                    embed.addField(`Old NSFW`, `${oldChannel.nsfw}`, true)
                    embed.addField(`New NSFW`, `${newChannel.nsfw}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.parentId !== newChannel.parentId) {
                    embed.addField(`Old Parent`, `<#${oldChannel.parentId}>`, true)
                    embed.addField(`New Parent`, `<#${newChannel.parentId}>`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.rawPosition !== newChannel.rawPosition) {
                    embed.addField(`Old Position`, `${oldChannel.rawPosition}`, true)
                    embed.addField(`New Position`, `${newChannel.rawPosition}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                logChannel.send({ embeds: [embed] });
                return;
            }
            const embed = new MessageEmbed()
                .setTitle("Text Channel Updated")
                .setDescription(`${newChannel}`)
                .setColor(colors.TEXT_CHANNEL_UPDATE)
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
                embed.addField(`Old NSFW`, `${oldChannel.nsfw}`, true)
                embed.addField(`New NSFW`, `${newChannel.nsfw}`, true)
                embed.addField(`**  **`, `**  **`, true)
            }
            if (oldChannel.parentId !== newChannel.parentId) {
                embed.addField(`Old Parent`, `<#${oldChannel.parentId}>`, true)
                embed.addField(`New Parent`, `<#${newChannel.parentId}>`, true)
                embed.addField(`**  **`, `**  **`, true)
            }
            if (oldChannel.rawPosition !== newChannel.rawPosition) {
                embed.addField(`Old Position`, `${oldChannel.rawPosition}`, true)
                embed.addField(`New Position`, `${newChannel.rawPosition}`, true)
                embed.addField(`**  **`, `**  **`, true)
            }
            logChannel.send({ embeds: [embed] });
        }

        if (oldChannel.type === "GUILD_NEWS") {
            if (newChannel.type === "GUILD_TEXT") {
                const embed = new MessageEmbed()
                    .setTitle("Text Channel Updated")
                    .setDescription(`${newChannel}`)
                    .setColor(colors.TEXT_CHANNEL_UPDATE)
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
                    embed.addField(`Old NSFW`, `${oldChannel.nsfw}`, true)
                    embed.addField(`New NSFW`, `${newChannel.nsfw}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.parentId !== newChannel.parentId) {
                    embed.addField(`Old Parent`, `<#${oldChannel.parentId}>`, true)
                    embed.addField(`New Parent`, `<#${newChannel.parentId}>`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                if (oldChannel.rawPosition !== newChannel.rawPosition) {
                    embed.addField(`Old Position`, `${oldChannel.rawPosition}`, true)
                    embed.addField(`New Position`, `${newChannel.rawPosition}`, true)
                    embed.addField(`**  **`, `**  **`, true)
                }
                logChannel.send({ embeds: [embed] });
            }
            const embed = new MessageEmbed()
                .setTitle("News Channel Updated")
                .setDescription(`Text Channel ${oldChannel} was turned into a news channel ${newChannel}!`)
                .setColor(colors.TEXT_TO_NEWS_CHANNEL_UPDATE)
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
                embed.addField(`Old NSFW`, `${oldChannel.nsfw}`, true)
                embed.addField(`New NSFW`, `${newChannel.nsfw}`, true)
                embed.addField(`**  **`, `**  **`, true)
            }
            if (oldChannel.parentId !== newChannel.parentId) {
                embed.addField(`Old Parent`, `<#${oldChannel.parentId}>`, true)
                embed.addField(`New Parent`, `<#${newChannel.parentId}>`, true)
                embed.addField(`**  **`, `**  **`, true)
            }
            if (oldChannel.rawPosition !== newChannel.rawPosition) {
                embed.addField(`Old Position`, `${oldChannel.rawPosition}`, true)
                embed.addField(`New Position`, `${newChannel.rawPosition}`, true)
                embed.addField(`**  **`, `**  **`, true)
            }
            logChannel.send({ embeds: [embed] });
            return;
        }

        if (oldChannel.type === "GUILD_VOICE") {
            const embed = new MessageEmbed()
                .setColor(colors.TEXT_CHANNEL_UPDATE)
                .setTitle("Voice Channel Updated")
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
                embed.addField(`Old Position`, `${oldChannel.rawPosition}`, true)
                embed.addField(`New Position`, `${newChannel.rawPosition}`, true)
                embed.addField(`**  **`, `**  **`, true)
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
                embed.addField(`Old Position`, `${oldChannel.rawPosition}`, true)
                embed.addField(`New Position`, `${newChannel.rawPosition}`, true)
                embed.addField(`**  **`, `**  **`, true)
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
                .setColor(colors.TEXT_CHANNEL_UPDATE)
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
                embed.addField(`Old Position`, `${oldChannel.rawPosition}`, true)
                embed.addField(`New Position`, `${newChannel.rawPosition}`, true)
                embed.addField(`**  **`, `**  **`, true)
            }
            logChannel.send({ embeds: [embed] });
        }
    }
}