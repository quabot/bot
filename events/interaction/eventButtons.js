const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const discord = require('discord.js')
const { createTranscript } = require('discord-html-transcripts');

const colors = require('../../files/colors.json');
const { noPermission } = require('../../files/embeds/config');
const { buttonsJoin, buttonsLeave } = require('../../files/interactions/events.js');
const { addedDatabase, errorMain } = require('../../files/embeds.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema')
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id
            },
                (err, guild) => {
                    if (err) console.error(err)
                    if (!guild) {
                        const newGuild = new Guild({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            logChannelID: 'none',
                            reportChannelID: 'none',
                            suggestChannelID: 'none',
                            welcomeChannelID: 'none',
                            levelChannelID: 'none',
                            pollChannelID: 'none',
                            ticketCategory: 'Tickets',
                            closedTicketCategory: 'Tickets',
                            logEnabled: true,
                            musicEnabled: true,
                            levelEnabled: false,
                            reportEnabled: true,
                            suggestEnabled: true,
                            ticketEnabled: true,
                            welcomeEnabled: true,
                            pollsEnabled: true,
                            roleEnabled: true,
                            mainRole: 'Member',
                            mutedRole: 'Muted',
                            joinMessage: "Welcome {user} to **{guild-name}**!",
                            swearEnabled: false,
transcriptChannelID: "none"
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: interaction.guild.id
            },
                (err, events) => {
                    if (err) console.error(err)
                    if (!events) {
                        const newEvents = new Events({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
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
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}