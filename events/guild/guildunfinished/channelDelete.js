const { commands } = require('../../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../../files/colors.json');
const consola = require('consola');
const Guild = require('../../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "channelDelete",
    /**
     * @param {Client} client 
     */
    async execute(channel, client) {

        const settings = await Guild.findOne({
            guildID: channel.guild.id
        }, (err, guild) => {
            if (err) return;
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: channel.guild.id,
                    guildName: channel.guild.name,
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
        const logChannel = channel.guild.channels.cache.get(settings.logChannelID);

        if (channel.type === "GUILD_TEXT") {
            if (settings.enableLog === "true") {
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setColor(colors.TEXT_CHANNEL_DELETE)
                        .setTitle('Text Channel Deleted!')
                        .addField('Name', `${channel.name}`)
                        .addField('ID', `${channel.id}`)
                        .setTimestamp()
                    logChannel.send({ embeds: [embed] });
                };
            }
        }
        if (channel.type === "GUILD_NEWS") {
            if (settings.enableLog === "true") {
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setColor(colors.NEWS_CHANNEL_DELETE)
                        .setTitle('Announcement Channel Deleted!')
                        .addField('Name', `${channel.name}`)
                        .addField('ID', `${channel.id}`)
                        .setTimestamp()
                    logChannel.send({ embeds: [embed] });
                };
            }
        }
        if (channel.type === "GUILD_STAGE_VOICE") {
            if (settings.enableLog === "true") {
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setColor(colors.STAGE_CHANNEL_DELETE)
                        .setTitle('Stage Channel Deleted!')
                        .addField('Name', `${channel.name}`)
                        .addField('ID', `${channel.id}`)
                        .setTimestamp()
                    logChannel.send({ embeds: [embed] });
                };
            }
        }
        if (channel.type === "GUILD_CATEGORY") {
            if (settings.enableLog === "true") {
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setColor(colors.CAT_CHANNEL_DELETE)
                        .setTitle('Category Deleted!')
                        .addField('Name', `${channel.name}`)
                        .addField('ID', `${channel.id}`)
                        .setTimestamp()
                    logChannel.send({ embeds: [embed] });
                };
            }
        }
        if (channel.type === "GUILD_VOICE") {
            if (settings.enableLog === "true") {
                if (logChannel) {
                    const embed = new MessageEmbed()
                        .setColor(colors.VOICE_CHANNEL_DELETE)
                        .setTitle('Voice Channel Deleted!')
                        .addField('Name', `${channel.name}`)
                        .addField('ID', `${channel.id}`)
                        .setTimestamp()
                    logChannel.send({ embeds: [embed] });
                };
            }
        }
    }
}