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

        if (settings.enableLog === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.GIVEAWAY_COLOR)
                    .setTitle('Channel Updated!')
                    .setDescription(`<#${newChannel.id}>`)
                    .addField('Old Name', `${oldChannel.parentId}`)
                    .addField('New Name', `${newChannel.parentId}`)
                    .addField('Channel ID', `${oldChannel.id}`, true)
                    .addField('Parent', `\`${oldChannel.parentId}/${newChannel.parentId}\``, true)
                    .addField('NSFW', `\`${oldChannel.nsfw}/${newChannel.nsfw}\``, true)
                    .addField('Old Topic', `${oldChannel.topic}`)
                    .addField('New Topic', `${newChannel.topic}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
    }
}