const colors = require('../../files/colors.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const consola = require('consola');
const { error, added } = require('../../embeds/general');

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
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                        });
                    return;
                }
            }).clone().catch(function (err) { console.log(err) });

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: newState.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: newState.guild.id,
                        guildName: newState.guild.name,
                        joinMessages: true,
                        leaveMessages: true,
                        channelCreateDelete: true,
                        channelUpdate: true,
                        emojiCreateDelete: true,
                        emojiUpdate: true,
                        inviteCreateDelete: true,
                        messageDelete: true,
                        messageUpdate: true,
                        roleCreateDelete: true,
                        roleUpdate: true,
                        voiceState: false,
                        voiceMove: false,
                        memberUpdate: true,
                        quabotLogging: true
                    })
                    newEvents.save().catch(err => {
                        console.log(err);
                    })
                    return;
                }
            }
            ).clone().catch(function (err) { console.log(err) });

            if (!eventsDatabase) return;
            if (!guildDatabase) return;

            const logChannel = newState.guild.channels.cache.get(guildDatabase.logChannelID);

            if (!logChannel) return;

            if (guildDatabase.logEnabled === "false") return;

            if (oldState.channelId === null) {
                if (eventsDatabase.voiceState === false) return;
                const embed = new MessageEmbed()
                    .setTitle("Member joined voice channel!")
                    .addField("Member", `<@${newState.id}>`)
                    .addField("Voice Channel", `<#${newState.channelId}>`)
                    .setColor(`GREEN`)
                    
                logChannel.send({ embeds: [embed] }).catch(err => console.log(err));
                return;
            }

            if (newState.channelId === null) {
                if (eventsDatabase.voiceState === false) return;
                const embed = new MessageEmbed()
                    .setTitle("Member left voice channel!")
                    .addField("Member", `<@${newState.id}>`)
                    .addField("Voice Channel", `<#${oldState.channelId}>`)
                    .setColor(`RED`)
                    
                logChannel.send({ embeds: [embed] }).catch(err => console.log(err));
                return;
            }

            if (oldState.channelId !== newState.channelId) {
                if (eventsDatabase.voiceMove === false) return;
                const embed = new MessageEmbed()
                    .setTitle("Member moved!")
                    .addField("Member", `<@${newState.id}>`)
                    .addField("Moved from", `<#${oldState.channelId}>`)
                    .addField("Moved to", `<#${newState.channelId}>`)
                    .setColor(`YELLOW`)
                    
                logChannel.send({ embeds: [embed] }).catch(err => console.log(err));
                return;
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
};