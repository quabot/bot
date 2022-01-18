const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/settings.json');
const { errorMain, addedDatabase, ticketsDisabled, notATicket } = require('../../files/embeds');

module.exports = {
    name: "settopic",
    description: "Change a ticket topic.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "new-topic",
            type: "STRING",
            description: "The new ticket topic.",
            required: true,
        },
    ],
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
                if (!ticket) return interaction.channel.send({ embeds: [notATicket] });
            });

            if (TicketDB === null) return;

            await TicketDB.updateOne({
                topic: `${interaction.options.getString("new-topic")}`,
            });

            const newTopic = new discord.MessageEmbed()
                .setTitle("Topic changed")
                .setColor(colors.COLOR)
                .setTimestamp()
                .setDescription(`New ticket topic: **${interaction.options.getString("new-topic")}**!`)
            interaction.reply({ embeds: [newTopic] });
            
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}