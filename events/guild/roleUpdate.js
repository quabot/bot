const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "roleUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldRole, newRole, client) {

        const settings = await Guild.findOne({
            guildID: oldRole.guild.id
        }, (err, guild) => {
            if (err) return;
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: oldRole.guild.id,
                    guildName: oldRole.guild.name,
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
        const logChannel = oldRole.guild.channels.cache.get(settings.logChannelID);

        if (settings.enableLog === "true") {
            if (logChannel) {
                console.log(oldRole)
                const oldPerms = oldRole.permissions.toArray().join("\n");
                const newPerms = newRole.permissions.toArray().join("\n");

                const permUpdated = oldPerms - newPerms;

                const embed = new MessageEmbed()
                    .setColor(colors.SAY_COLOR)
                    .setDescription(`<@&${newRole.id}>`)
                    .setTitle('Role Updated!')
                    .addField('Old Role Name', `${oldRole.name}`, true)
                    .addField('New Role Name', `${newRole.name}`, true)
                    .addField('Role-ID', `${newRole.id}`, true)
                    .addField('Colors', `\`${oldRole.color}\` -> \`${newRole.color}\``)
                if (oldRole.permissions > newRole.permissions) {
                    //Permission lost
        
                    embed.setDescription(`**${newRole.toString()} has lost a permission!**`)
                    logChannel.send({ embeds: [embed] }).catch()
        
                } else if (oldRole.permissions < newRole.permissions) {
                    //Permission given
        
                    embed.setDescription(`**${newRole.toString()} has been given a permission!**`)
                    logChannel.send({ embeds: [embed] }).catch()
        
                } else {
                    logChannel.send({ embeds: [embed] }).catch();
                }
            };
        }
    }
}