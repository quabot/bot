const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: "roleCreate",
    /**
     * @param {Client} client 
     */
    async execute(role, client) {

        const settings = await Guild.findOne({
            guildID: role.guild.id
        }, (err, guild) => {
            if (err) return;
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: role.guild.id,
                    guildName: role.guild.name,
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
        const logChannel = role.guild.channels.cache.get(settings.logChannelID);

        if (settings.enableLog === "true") {
            if (logChannel) {
                console.log(role)
                const perms = role.permissions.toArray().join("\n");
                console.log(role.color)
                const embed = new MessageEmbed()
                    .setColor(colors.SAY_COLOR)
                    .setDescription(`<@&${role.id}>`)
                    .setTitle('Role Created!')
                    .addField('Role', `${role.name}`)
                    .addField('Role-ID', `${role.id}`)
                    .addField('Permissions:', `\`${perms}\``)
                logChannel.send({ embeds: [embed] });
            };
        }
    }
}