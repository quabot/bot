const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "channelCreate",
    /**
     * @param {Client} client 
     */
    async execute(channel, client) {

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
                    mainRole: "Member",
                    mutedRole: "Muted"
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });
                return interaction.channel.send({ embeds: [addedDatabase] });
            }
        });

        const logChannel = channel.guild.channels.cache.get(guildDatabase.logChannelID);

        if(channel.type === "GUILD_TEXT") {
            if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.TEXT_CHANNEL_CREATE)
                    .setDescription(`<#${channel.id}>`)
                    .setTitle('Text Channel Created!')
                    .addField('Name', `${channel.name}`)
                    .addField('ID', `${channel.id}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
        }
        if(channel.type === "GUILD_NEWS") {
            if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.NEWS_CHANNEL_CREATE)
                    .setDescription(`<#${channel.id}>`)
                    .setTitle('Announcement Channel Created!')
                    .addField('Name', `${channel.name}`)
                    .addField('ID', `${channel.id}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
        }
        if(channel.type === "GUILD_STAGE_VOICE") {
            if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.STAGE_CHANNEL_CREATE)
                    .setDescription(`<#${channel.id}>`)
                    .setTitle('Stage Channel Created!')
                    .addField('Name', `${channel.name}`)
                    .addField('ID', `${channel.id}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
        }
        if(channel.type === "GUILD_CATEGORY") {
            if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.CAT_CHANNEL_CREATE)
                    .setDescription(`<#${channel.id}>`)
                    .setTitle('Category Created!')
                    .addField('Name', `${channel.name}`)
                    .addField('ID', `${channel.id}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
        }
        if(channel.type === "GUILD_VOICE") {
            if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.VOICE_CHANNEL_CREATE)
                    .setDescription(`<#${channel.id}>`)
                    .setTitle('Voice Channel Created!')
                    .addField('Name', `${channel.name}`)
                    .addField('ID', `${channel.id}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
        }
        
    }
}