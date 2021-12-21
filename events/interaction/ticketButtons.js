const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const { errorMain, ticketsDisabled, addedDatabase, notATicket } = require('../../files/embeds');
const { closeConfirm, closed, close } = require('../../files/interactions/tickets');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        // failsaves
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

            if (interaction.isButton()) {
                if (interaction.customId === "close") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                    const close = new MessageEmbed()
                        .setTitle("Close ticket")
                        .setDescription("Are you sure you want to close this ticket?")
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [close], components: [closeConfirm] })
                }
                if (interaction.customId === "closeconfirm") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    let closedName = guildDatabase.closedTicketCategory;
                    if (closedName === undefined) openedName = 'Closed Tickets';
                    const closedCategory = interaction.guild.channels.cache.find(cat => cat.name === closedName);

                    if (!closedCategory) {
                        interaction.guild.channels.create(closedName, { type: "GUILD_CATEGORY" });
                        const embedTicketsCreate = new discord.MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle('Creating a category!')
                            .setDescription('The categegory for closed tickets does not exist. Creating one now...')
                            .setTimestamp()
                        interaction.reply({ embeds: [embedTicketsCreate] })
                        return
                    }

                    interaction.channel.setParent(closedCategory);
                    interaction.channel.permissionOverwrites.edit(interaction.user, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    });

                    const embed = new MessageEmbed()
                        .setTitle("Closed Ticket!")
                        .setDescription("Reopen it, delete it, or get the transcript with the buttons below this message.")
                        .setTimestamp()
                        .setColor(colors.COLOR);
                    interaction.update({ embeds: [embed], components: [closed] });


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

                    await TicketDB.updateOne({
                        closed: true,
                    });
                }
                if (interaction.customId === "closecancel") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                    const closeCancel = new MessageEmbed()
                        .setTitle(":x: Cancelled!")
                        .setDescription("Cancelled the closing of the ticket.")
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.update({ embeds: [closeCancel], components: [] })
                }
                if (interaction.customId === "reopen") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    let openedName = guildDatabase.ticketCategory;
                    if (openedName === undefined) openedName = 'Tickets';
                    const category = interaction.guild.channels.cache.find(cat => cat.name === openedName);

                    if (!category) {
                        interaction.guild.channels.create(openedName, { type: "GUILD_CATEGORY" });
                        const embedTicketsCreate = new discord.MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle('Creating a category!')
                            .setDescription('The categegory for opened tickets does not exist. Creating one now...')
                            .setTimestamp()
                        interaction.reply({ embeds: [embedTicketsCreate] })
                        return
                    }

                    interaction.channel.setParent(category);
                    interaction.channel.permissionOverwrites.edit(interaction.user, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    });

                    const embed = new MessageEmbed()
                        .setTitle("Re-Opened Ticket!")
                        .setDescription("Close it with the button below this message.")
                        .setTimestamp()
                        .setColor(colors.COLOR);
                    interaction.update({ embeds: [embed], components: [close] });


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

                    await TicketDB.updateOne({
                        closed: false,
                    });
                }
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}