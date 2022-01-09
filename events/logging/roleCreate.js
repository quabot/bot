const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "roleCreate",
    /**
     * @param {Client} client 
     */
    async execute(role, client) {

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: role.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: role.guild.id,
                        guildName: role.guild.name,
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
                        roleEnabled: true
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            });
            const logChannel = role.guild.channels.cache.get(guildDatabase.logChannelID);

            if (!logChannel) return;
            
            if (guildDatabase.logEnabled === "true") {
                if (logChannel) {
                    let perms = role.permissions.toArray().join("\n")
                    let permsLength = String(perms);
                    if (permsLength.length > 1022) perms = "Too long for message embed."
                    const embed = new MessageEmbed()
                        .setColor(`${role.hexColor}`)
                        .setDescription(`<@&${role.id}>`)
                        .setTitle('Role Created!')
                        .addField('Role', `${role.name}`)
                        .setFooter(`Role-ID: ${role.id}`)
                        .addField('Permissions:', `\`${perms}\``)
                    logChannel.send({ embeds: [embed] });
                };
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}