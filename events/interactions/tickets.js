const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { createTranscript } = require('discord-html-transcripts');

const { COLOR_MAIN } = require('../../files/colors.json');
const { closeConfirm, closed, close, deleteConfirm } = require('../../interactions/tickets');
const { ticketDis, notATicket } = require('../../embeds/support');

const { error, added } = require('../../embeds/general')

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (interaction.guild.id === null) return;


        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
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
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            const transcriptChannel = interaction.guild.channels.cache.get(guildDatabase.transcriptChannelID);

            if (interaction.isButton()) {
                if (interaction.customId === "ticket") {
                    const topic = "No topic specified.";

                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));

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
                                    interaction.channel.send({ embeds: [error] })
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
                            .setColor(`GREEN`)
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
                            .setColor(COLOR_MAIN)
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
                                interaction.channel.send({ embeds: [error] });
                            });

                        setTimeout(() => {
                            let ticket = interaction.guild.channels.cache.find(channel => channel.name === `ticket-${newId}`);
                            ticket.permissionOverwrites.edit(interaction.user, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true
                            });

                            const embed = new MessageEmbed()
                                .setColor(`GREEN`)
                                .setTitle("Created your ticket :white_check_mark:")
                                .setDescription("You can find it here: <#" + channel + ">")
                                .addField("Topic", `${topic}`)
                                .setTimestamp()
                            interaction.reply({ ephemeral: true, embeds: [embed] })
                        }, 300);
                    });
                }
                if (interaction.customId === "close") {
                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));
                    const close = new MessageEmbed()
                        .setTitle("Close ticket")
                        .setDescription("Are you sure you want to close this ticket?")
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    interaction.reply({ embeds: [close], components: [closeConfirm] })
                }
                if (interaction.customId === "closeconfirm") {
                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));

                    let closedName = guildDatabase.closedTicketCategory;
                    if (closedName === undefined) openedName = 'Closed Tickets';
                    const closedCategory = interaction.guild.channels.cache.find(cat => cat.name === closedName);

                    if (!closedCategory) {
                        interaction.guild.channels.create(closedName, { type: "GUILD_CATEGORY" });
                        const embedTicketsCreate = new MessageEmbed()
                            .setColor(`GREEN`)
                            .setTitle('Creating a category!')
                            .setDescription('The categegory for closed tickets does not exist. Creating one now...')
                            .setTimestamp()
                        interaction.reply({ embeds: [embedTicketsCreate] })
                        return
                    }
                    let cId = interaction.channel.name;
                    cId = cId.substring(7);
                    console.log(cId)

                    const Ticket = require('../../schemas/TicketSchema')
                    const TicketDB = await Ticket.findOne({
                        guildId: interaction.guild.id,
                        ticketId: cId,
                        channelId: interaction.channel.id,
                    }, (err, ticket) => {
                        if (err) return;
                        if (!ticket) return interaction.channel.send({ embeds: [notATicket] });
                    }).clone().catch(function (err) { console.log(err) });

                    if (!TicketDB) return;

                    await TicketDB.updateOne({
                        closed: true,
                    });

                    interaction.channel.setParent(closedCategory);
                    interaction.channel.setParent(closedCategory);
                    let userFound = interaction.guild.members.cache.get(`${TicketDB.memberId}`);
                    setTimeout(() => {
                        interaction.channel.permissionOverwrites.edit(userFound, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true
                        });
                    }, 1000);


                    const embed = new MessageEmbed()
                        .setTitle("Closed Ticket!")
                        .setDescription("Reopen it, delete it, or get the transcript with the buttons below this message.")
                        .setTimestamp()
                        .setColor(COLOR_MAIN);
                    interaction.update({ embeds: [embed], components: [closed] });
                    
                    if (transcriptChannel) {
                        const transcriptembed = new MessageEmbed()
                            .setTitle("Transcript saved.")
                            .setColor(COLOR_MAIN)
                            .setDescription(`Ticket ID: ${cId}\nChannel: ${interaction.channel}`)
                        const attachementtranscript = await createTranscript(interaction.channel, {
                            limit: -2,
                            returnBuffer: false,
                            fileName: `ticket-${cId}.html`,
                        });
                        transcriptChannel.send({ embeds: [transcriptembed], components: [], files: [attachementtranscript] })
                        
                    }
                }
                if (interaction.customId === "closecancel") {
                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));
                    const closeCancel = new MessageEmbed()
                        .setTitle(":x: Cancelled!")
                        .setDescription("Cancelled the closing of the ticket.")
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    interaction.update({ embeds: [closeCancel], components: [] })
                }
                if (interaction.customId === "reopen") {
                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));

                    let openedName = guildDatabase.ticketCategory;
                    if (openedName === undefined) openedName = 'Tickets';
                    const category = interaction.guild.channels.cache.find(cat => cat.name === openedName);

                    if (!category) {
                        interaction.guild.channels.create(openedName, { type: "GUILD_CATEGORY" });
                        const embedTicketsCreate = new MessageEmbed()
                            .setColor(`GREEN`)
                            .setTitle('Creating a category!')
                            .setDescription('The categegory for opened tickets does not exist. Creating one now...')
                            .setTimestamp()
                        interaction.reply({ embeds: [embedTicketsCreate] })
                        return
                    }

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
                    }).clone().catch(function (err) { console.log(err) });

                    await TicketDB.updateOne({
                        closed: false,
                    });

                    interaction.channel.setParent(category);
                    interaction.channel.setParent(category);
                    setTimeout(() => {
                        interaction.channel.permissionOverwrites.edit(TicketDB.memberId, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true
                        });
                    }, 1000);

                    const embed = new MessageEmbed()
                        .setTitle("Re-Opened Ticket!")
                        .setDescription("Close it with the button below this message.")
                        .setTimestamp()
                        .setColor(COLOR_MAIN);
                    interaction.update({ embeds: [embed], components: [close] });

                }
                if (interaction.customId === "transcript") {
                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));
                    let cId = interaction.channel.name;
                    cId = cId.substring(7);
                    const transcript = new MessageEmbed()
                        .setTitle("Transcript saved!")
                        .setDescription("Here is your transcript of this ticket. Download and open it to view it!")
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    const attachement = await createTranscript(interaction.channel, {
                        limit: -2,
                        returnBuffer: false,
                        fileName: `ticket-${cId}.html`,
                    });
                    interaction.reply({ embeds: [transcript], components: [], files: [attachement] })

                }
                if (interaction.customId === "deleteconfirm") {
                    let cId = interaction.channel.name;
                    cId = cId.substring(7);
                    if (transcriptChannel) {
                        const transcriptembed = new MessageEmbed()
                            .setTitle("Transcript saved.")
                            .setColor(COLOR_MAIN)
                            .setDescription(`Ticket ID: ${cId}\nChannel: ${interaction.channel}`)
                        const attachementtranscript = await createTranscript(interaction.channel, {
                            limit: -2,
                            returnBuffer: false,
                            fileName: `ticket-${cId}.html`,
                        });
                        transcriptChannel.send({ embeds: [transcriptembed], components: [], files: [attachementtranscript] })
                        
                    }
                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));

                    setTimeout(() => {
                        interaction.channel.delete();
                    }, 3000);

                    const embed = new MessageEmbed()
                        .setTitle("Deleting ticket!")
                        .setDescription("This cannot be undone. Creating final transcript and logging it now...")
                        .setTimestamp()
                        .setColor(COLOR_MAIN);
                    interaction.update({ embeds: [embed], components: [] });

                    const Ticket = require('../../schemas/TicketSchema')
                    const TicketDB = await Ticket.findOne({
                        guildId: interaction.guild.id,
                        ticketId: cId,
                        channelId: interaction.channel.id,
                    }, (err, ticket) => {
                        if (err) return;
                        if (!ticket) return interaction.channel.send({ embeds: [notATicket] });
                    }).clone().catch(function (err) { console.log(err) });

                    await TicketDB.updateOne({
                        closed: true,
                    });
                }
                if (interaction.customId === "deletecancel") {
                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));
                    const deleteCancel = new MessageEmbed()
                        .setTitle(":x: Cancelled!")
                        .setDescription("Cancelled the deletion of the ticket.")
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    interaction.update({ embeds: [deleteCancel], components: [] })
                }
                if (interaction.customId === "delete") {
                     if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));
                    const deleteEmbed = new MessageEmbed()
                        .setTitle("Delete ticket")
                        .setDescription("Are you sure you want to delete this ticket?")
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    interaction.reply({ embeds: [deleteEmbed], components: [deleteConfirm] })
                }
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}