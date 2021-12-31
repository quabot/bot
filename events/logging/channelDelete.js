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
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            });
            const logChannel = channel.guild.channels.cache.get(guildDatabase.logChannelID);

            if (channel.type === "GUILD_TEXT") {
                if (guildDatabase.logEnabled === "true") {
                    if (logChannel) {
                        const embed = new MessageEmbed()
                            .setColor(colors.LIME)
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
                            .setColor(colors.LIME)
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
                            .setColor(colors.LIME)
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
                            .setColor(colors.LIME)
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
                            .setColor(colors.LIME)
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