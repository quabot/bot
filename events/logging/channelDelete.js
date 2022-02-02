const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "channelDelete",
    /**
     * @param {Client} client 
     */
    async execute(channel, client) {
        if (channel.guild.id === null) return;
        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: channel.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: channel.guild.id,
                        guildName: channel.guild.name,
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
                        swearEnabled: false,
transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            });
            const logChannel = channel.guild.channels.cache.get(guildDatabase.logChannelID);
            if (guildDatabase.logEnabled === "false") return;


            if (channel.type === "GUILD_TEXT") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(colors.RED)
                            .setTitle('Text Channel Deleted!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            .setTimestamp()
                        logChannel.send({ embeds: [embed] });
                    };
                }
            }
            if (channel.type === "GUILD_NEWS") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(colors.RED)
                            .setTitle('Announcement Channel Deleted!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            .setTimestamp()
                        logChannel.send({ embeds: [embed] });
                    };
                }
            }
            if (channel.type === "GUILD_STAGE_VOICE") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(colors.RED)
                            .setTitle('Stage Channel Deleted!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            .setTimestamp()
                        logChannel.send({ embeds: [embed] });
                    };
                }
            }
            if (channel.type === "GUILD_CATEGORY") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(colors.RED)
                            .setTitle('Category Deleted!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            .setTimestamp()
                        logChannel.send({ embeds: [embed] });
                    };
                }
            }
            if (channel.type === "GUILD_VOICE") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(colors.RED)
                            .setTitle('Voice Channel Deleted!')
                            .addField('Name', `${channel.name}`)
                            .addField('ID', `${channel.id}`)
                            .setTimestamp()
                        logChannel.send({ embeds: [embed] });
                    };
                }
            }
        } catch (e) {
            console.log(e);
            return;
        }


    }
}