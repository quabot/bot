const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola');
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "voiceStateUpdate",
    /**
     * @param {Client} client 
     */
    async execute(oldState, newState) {
        try {
            if (newState.guild.id === null) return;

            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: newState.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: newState.guild.id,
                        guildName: newState.guild.name,
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
            const logChannel = newState.guild.channels.cache.get(guildDatabase.logChannelID);

            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;

            if (oldState.channelId === null) {
                const embed = new MessageEmbed()
                    .setTitle("Member joined voice channel!")
                    .addField("Member", `<@${newState.id}>`)
                    .addField("Voice Channel", `<#${newState.channelId}>`)
                    .setColor(colors.VOICE_JOIN_COLOR)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
                return;
            }

            if (newState.channelId === null) {
                const embed = new MessageEmbed()
                    .setTitle("Member left voice channel!")
                    .addField("Member", `<@${newState.id}>`)
                    .addField("Voice Channel", `<#${oldState.channelId}>`)
                    .setColor(colors.VOICE_LEAVE_COLOR)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
                return;
            }

            if (oldState.channelId !== newState.channelId) {
                const embed = new MessageEmbed()
                    .setTitle("Member moved!")
                    .addField("Member", `<@${newState.id}>`)
                    .addField("Moved from", `<#${oldState.channelId}>`)
                    .addField("Moved to", `<#${newState.channelId}>`)
                    .setColor(colors.VOICE_MOVE_COLOR)
                    .setTimestamp()
                logChannel.send({ embeds: [embed] });
                return;
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
};