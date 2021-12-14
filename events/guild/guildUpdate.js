const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "guildUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldGuild, newGuild, client) {

        try {
            const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: newGuild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: newGuild.id,
                    guildName: newGuild.name,
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
        const logChannel = newGuild.channels.cache.get(guildDatabase.logChannelID);

        if(oldGuild.name !== newGuild.name) {
            await guildDatabase.updateOne({
                guildName: newGuild.name
            });
        }
        if (guildDatabase.logEnabled === "true") {
            if (guildDatabase) {
                const embed = new MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle('Guild Updated!')
                    .setTimestamp()
                    .addField("Guild ID", `${newGuild.id}`)
                if (newGuild.name !== oldGuild.name) {
                    embed.addField(`Old Name`, `${oldGuild.name}`, true)
                    embed.addField(`New Name`, `${newGuild.name}`, true)
                    embed.addField(`** **`, `** **`, true)
                }
                if (newGuild.description !== oldGuild.description) {
                    embed.addField(`Old Description`, `${oldGuild.description}`, true)
                    embed.addField(`New Description`, `${newGuild.description}`, true)
                    embed.addField(`** **`, `** **`, true)
                }
                if (newGuild.verificationLevel !== oldGuild.verificationLevel) {
                    embed.addField(`Old Verificationlevel`, `${oldGuild.verificationLevel}`, true)
                    embed.addField(`New Verificationlevel`, `${newGuild.verificationLevel}`, true)
                    embed.addField(`** **`, `** **`, true)
                }
                if (newGuild.afkTimeout !== oldGuild.afkTimeout) {
                    embed.addField(`Old AFK Timeout`, `${oldGuild.afkTimeout / 60} minutes`, true)
                    embed.addField(`New AFK Timeout`, `${newGuild.afkTimeout / 60} minutes`, true)
                    embed.addField(`** **`, `** **`, true)
                }
                if (newGuild.afkChannelId !== oldGuild.afkChannelId) {
                    embed.addField(`Old AFK Channel`, `<#${oldGuild.afkChannelId}>`, true)
                    embed.addField(`New AFK Channel`, `<#${newGuild.afkChannelId}>`, true)
                    embed.addField(`** **`, `** **`, true)
                }
                if (newGuild.ownerId !== oldGuild.ownerId) {
                    embed.addField(`Old Owner`, `<@${oldGuild.ownerId}>`, true)
                    embed.addField(`New Owner`, `<@${newGuild.ownerId}>`, true)
                    embed.addField(`** **`, `** **`, true)
                }
                if (newGuild.widgetEnabled !== oldGuild.widgetEnabled) {
                    embed.addField(`Widget is now`, `${newGuild.widgetEnabled}>`, true)
                    embed.addField(`** **`, `** **`, true)
                    embed.addField(`** **`, `** **`, true)
                }
                logChannel.send({ embeds: [embed] });
            };
        }
        } catch (e) {
            console.log(e);
            return;
        }

        
    }
}