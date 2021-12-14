const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "messageDelete",
    /**
     * @param {Client} client 
     */
    async execute(message, client) {

        try {
             const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: message.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: message.guild.id,
                    guildName: message.guild.name,
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
        const logChannel = message.guild.channels.cache.get(guildDatabase.logChannelID);


        if (guildDatabase.logEnabled === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle('Message Deleted')
                    .addField('Channel', `<#${message.channelId}>`)
                    .addField('Author', `<@${message.author.id}>`)
                    .addField('Content', `${message.content}** **`)
                    .addField('Message ID', `${message.id}`)
                    .addField('Attachment', `${message.attachments.proxyUrl}`)
                return logChannel.send({ embeds: [embed] });
            };
        } else {
            return;
        }
        } catch (e) {
            console.log(e);
            return;
        }

       
    }
}