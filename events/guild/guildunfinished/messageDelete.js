const { commands } = require('../../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../../files/colors.json');
const consola = require('consola');
const Guild = require('../../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "messageDelete",
    /**
     * @param {Client} client 
     */
    async execute(message, client) {

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    //_id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
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
                    .catch(err => message.channel.send({ embeds: [errorMain] }));

                return message.channel.send({ embeds: [addedDatabase] });
            }
        });
        const logChannel = message.guild.channels.cache.get(settings.logChannelID);
        console.log(message)

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle('Message Deleted')
                    .addField('Channel', `<#${message.channelId}>`)
                    .addField('Author', `<@${message.author.id}>`)
                    .addField('Content', `** ${message.content}**`)
                    .addField('Message ID', `${message.id}`)
                return logChannel.send({ embeds: [embed]});
            };
        } else {
            return;
        }
    }
}