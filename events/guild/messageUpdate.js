const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldMessage, newMessage, client) {

        if (oldMessage.author.bot) return

        const Guild = require('./schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: oldMessage.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: oldMessage.guild.id,
                    guildName: oldMessage.guild.name,
                    logChannelID: "none",
                    reportChannelID: "none",
                    suggestChannelID: "none",
                    welcomeChannelID: "none",
                    levelChannelID: "none",
                    pollChannelID: "none",
                    ticketCategory: "Tickets",
                    closedTicketCategory: "Closed Tickets",
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
                        message.channel.send({ embeds: [errorMain] });
                    });
                return message.channel.send({ embeds: [addedDatabase] });
            }
        });
        const logChannel = oldMessage.guild.channels.cache.get(guildDatabase.logChannelID);
        console.log(oldMessage)

        if (guildDatabase.logEnabled === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new MessageEmbed()
                    .setColor(colors.GIVEAWAY_COLOR)
                    .setTitle('Message Edited!')
                    .addField('Channel', `<#${oldMessage.channelId}>`)
                    .addField('Author', `<@${oldMessage.author.id}>`)
                    .addField('Old Content', `\`${oldMessage.content}\``)
                    .addField('New Content', `\`${newMessage.content}\``)
                    .addField('Message ID', `${newMessage.id}`)
                return logChannel.send({ embeds: [embed] });
            };
        } else {
            return;
        }
    }
}