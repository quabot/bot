const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "roleUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldRole, newRole, client) {
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
            const logChannel = oldRole.guild.channels.cache.get(guildDatabase.logChannelID);

            if (guildDatabase.logEnabled === "true") {
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
        } catch (e) {
            console.log(e);
            return;
        }
    }
}