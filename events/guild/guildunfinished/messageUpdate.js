const { commands } = require('../../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../../files/colors.json');
const consola = require('consola');
const Guild = require('../../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldMessage, newMessage, client) {

        if (oldMessage.author.bot) return

        const settings = await Guild.findOne({
            guildID: oldMessage.guild.id
        }, (err, guild) => {
            if (err) oldMessage.channel.send({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    //_id: mongoose.Types.ObjectID(),
                    guildID: oldMessage.guild.id,
                    guildName: oldMessage.guild.name,
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
                    .catch(err => oldMessage.channel.send({ embeds: [errorMain] }));

                return oldMessage.channel.send({ embeds: [addedDatabase] });
            }
        });
        const logChannel = oldMessage.guild.channels.cache.get(settings.logChannelID);
        console.log(oldMessage)

        if (settings.enableLog === "true") {
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