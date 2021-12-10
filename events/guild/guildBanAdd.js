const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "guildBanAdd",
    /**
     * @param {Client} client 
     */
    async execute(guild, user) {

        const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: channel.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: channel.guild.id,
                    guildName: channel.guild.name,
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

        const logChannel = channel.guild.channels.cache.get(guildDatabase.logChannelID);


        if (guildDatabase.logEnabled === "true") {
            if (logChannel) {
                const embed = new MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle('User Banned')
                    .addField('User', `${user}`)
                    .addField('User-ID', `${user.id}`)
                    .addField("Guild", `${guild}`)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
            };
        }
    }
}