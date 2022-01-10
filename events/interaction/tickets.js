const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { createTranscript } = require('discord-html-transcripts');

const colors = require('../../files/colors.json');
const { errorMain, ticketsDisabled, addedDatabase, notATicket,createTicket } = require('../../files/embeds');
const { closeConfirm, closed, close, deleteConfirm } = require('../../files/interactions/tickets');
const { ticketButton } = require('../../files/interactions');

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
                if (interaction.customId === "ticket") {
                    const topic = "No topic specified.";

                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    const GIds = require('../../schemas/GuildIds');
                    const GIdsDB = await GIds.findOne({
                        verifyToken: 1,
                        gId: interaction.guild.id
                    },
                        (err, gids) => {
                            if (err) return;
                            if (!gids) {
                                const newGids = new GIds({
                                    verifyToken: 1,
                                    gId: interaction.guild.id,
                                    ticketId: 0,
                                    suggestId: 0,
                                    pollId: 0,
                                })
                                newGids.save().catch(err => {
                                    console.log(err)
                                    interaction.channel.send({ embeds: [errorMain] })
                                })
                                return interaction.channel.send({ embeds: [addedDatabase] })
                            }
                        }
                    );

                    let newId = GIdsDB.ticketId + 1;
                    await GIdsDB.updateOne({
                        ticketId: newId,
                    });

                    let openedName = guildDatabase.ticketCategory;
                    if (openedName === undefined) openedName = 'Tickets';
                    const category = interaction.guild.channels.cache.find(cat => cat.name === openedName);

                    if (!category) {
                        interaction.guild.channels.create(openedName, { type: "GUILD_CATEGORY" });
                        const embedTicketsCreate = new MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle('Creating a category!')
                            .setDescription('The tickets categegory does not exist. Creating one now...')
                            .setTimestamp()
                        interaction.reply({ embeds: [embedTicketsCreate] })
                        return
                    }

                    interaction.guild.channels.create(`ticket-${newId}`, { parent: category, topic: `Creator: ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}) - Topic: ${topic} - Ticket ID: ${newId}` }).then(channel => {

                        const createdEmbed = new MessageEmbed()
                            .setTitle("New ticket!")
                            .setDescription(`Welcome to your ticket ${interaction.user}! \nPlease wait here, staff will be with you shortly.`)
                            .addField(`Creator`, `${interaction.user}`)
                            .addField(`Topic`, `${topic}`)
                            .setFooter("Close the ticket with the button below this message!")
                            .setTimestamp()
                            .setColor(colors.COLOR)
                        channel.send({ embeds: [createdEmbed], components: [close] });

                        const Ticket = require('../../schemas/TicketSchema')
                        const newTicket = new Ticket({
                            guildId: interaction.guild.id,
                            memberId: interaction.user.id,
                            ticketId: newId,
                            channelId: channel.id,
                            closed: false,
                            topic: topic,
                        });
                        newTicket.save()
                            .catch(err => {
                                console.log(err);
                                interaction.channel.send({ embeds: [errorMain] });
                            });

                        setTimeout(() => {
                            let ticket = interaction.guild.channels.cache.find(channel => channel.name === `ticket-${newId}`);
                            ticket.permissionOverwrites.edit(interaction.user, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true
                            });

                            const embed = new MessageEmbed()
                                .setColor(colors.TICKET_CREATED)
                                .setTitle("Created your ticket :white_check_mark:")
                                .setDescription("You can find it here: <#" + channel + ">")
                                .addField("Topic", `${topic}`)
                                .setTimestamp()
                            interaction.reply({ ephemeral: true, embeds: [embed] })
                        }, 300);
                    });
                }
                if (interaction.customId === "ticketmsg") {
                    interaction.reply({ embeds: [createTicket], components: [ticketButton]});
                }
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
                        const embedTicketsCreate = new MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle('Creating a category!')
                            .setDescription('The categegory for closed tickets does not exist. Creating one now...')
                            .setTimestamp()
                        interaction.reply({ embeds: [embedTicketsCreate] })
                        return
                    }

                    interaction.channel.setParent(closedCategory);
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
                        const embedTicketsCreate = new MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle('Creating a category!')
                            .setDescription('The categegory for opened tickets does not exist. Creating one now...')
                            .setTimestamp()
                        interaction.reply({ embeds: [embedTicketsCreate] })
                        return
                    }

                    interaction.channel.setParent(category);
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
                if (interaction.customId === "transcript") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                    let cId = interaction.channel.name;
                    cId = cId.substring(7);
                    const transcript = new MessageEmbed()
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

                }
                if (interaction.customId === "deleteconfirm") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    setTimeout(() => {
                        interaction.channel.delete();
                    }, 2000);

                    const embed = new MessageEmbed()
                        .setTitle("Deleting ticket!")
                        .setDescription("This cannot be undone.")
                        .setTimestamp()
                        .setColor(colors.COLOR);
                    interaction.update({ embeds: [embed], components: [] });


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
                if (interaction.customId === "deletecancel") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                    const deleteCancel = new MessageEmbed()
                        .setTitle(":x: Cancelled!")
                        .setDescription("Cancelled the deletion of the ticket.")
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.update({ embeds: [deleteCancel], components: [] })
                }
                if (interaction.customId === "delete") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                    const deleteEmbed = new MessageEmbed()
                        .setTitle("Delete ticket")
                        .setDescription("Are you sure you want to delete this ticket?")
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [deleteEmbed], components: [deleteConfirm] })
                }
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}