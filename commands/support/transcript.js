const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const { createTranscript } = require('discord-html-transcripts');
const { errorMain, addedDatabase, ticketsDisabled, notATicket } = require('../../files/embeds');

module.exports = {
    name: "transcript",
    description: "Make a ticket transcript.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

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
                            levelEnabled: true,
                            reportEnabled: true,
                            suggestEnabled: true,
                            ticketEnabled: true,
                            welcomeEnabled: true,
                            pollsEnabled: true,
                            roleEnabled: true,
                            mainRole: 'Member',
                            mutedRole: 'Muted'
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

            let cId = interaction.channel.name;
            cId = cId.substring(7);

            const Ticket = require('../../schemas/TicketSchema')
            const TicketDB = await Ticket.findOne({
                guildId: interaction.guild.id,
                ticketId: cId,
                channelId: interaction.channel.id,
            }, (err, ticket) => {
                if (err) return;
                if (!ticket) return interaction.reply({ embeds: [notATicket] });
            });
            if (TicketDB === null) return;

            const transcript = new discord.MessageEmbed()
                .setTitle("Transcript saved!")
                .setDescription("Here is your transcript of this ticket. Download and open it to view it!")
                .setColor(colors.COLOR)
                .setTimestamp()
            const attachement = await createTranscript(interaction.channel, {
                limit: -2,
                returnBuffer: false,
                fileName: `ticket-${cId}.html`,
            });
            interaction.reply({ embeds: [transcript], components: [], files: [attachement] })

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}