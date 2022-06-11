const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message } = require('discord.js');
const closeTicket = require('../../interactions/buttons/tickets/close-ticket');

module.exports = {
    name: "ticket",
    description: 'Ticket Module.',
    options: [
        {
            name: "create",
            description: "Create a ticket.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "topic",
                    type: "STRING",
                    required: false,
                    description: "The ticket topic."
                }
            ]
        },
        {
            name: "close",
            description: "Close a ticket.",
            type: "SUB_COMMAND",
        },
        {
            name: "delete",
            description: "Delete a ticket.",
            type: "SUB_COMMAND",
        },
        {
            name: "add",
            description: "Add a user to the ticket.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    type: "USER",
                    required: true,
                    description: "The user to add."
                },
            ],
        },
        {
            name: "remove",
            description: "Remove a user from the ticket.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    type: "USER",
                    required: true,
                    description: "The user to remove."
                },
            ],
        },
    ],
    async execute(client, interaction, color) {

        const Guild = require('../../structures/schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    logChannelID: "none",
                    ticketCategory: "none",
                    ticketClosedCategory: "none",
                    ticketEnabled: true,
                    ticketStaffPing: true,
                    ticketTopicButton: true,
                    ticketSupport: "none",
                    ticketId: 1,
                    ticketLogs: true,
                    ticketChannelID: "none",
                    afkStatusAllowed: "true",
                    musicEnabled: "true",
                    musicOneChannelEnabled: "false",
                    musicChannelID: "none",
                    suggestChannelID: "none",
                    logSuggestChannelID: "none",
                    logPollChannelID: "none",
                    afkEnabled: true,
                    welcomeChannelID: "none",
                    leaveChannelID: "none",
                    levelChannelID: "none",
                    punishmentChannelID: "none",
                    pollID: 0,
                    logEnabled: true,
                    modEnabled: true,
                    levelEnabled: false,
                    welcomeEmbed: true,
                    pollEnabled: true,
                    suggestEnabled: true,
                    welcomeEnabled: true,
                    leaveEnabled: true,
                    roleEnabled: false,
                    mainRole: "none",
                    joinMessage: "Welcome {user} to **{guild}**!",
                    leaveMessage: "Goodbye {user}!",
                    swearEnabled: false,
                    levelCard: false,
                    levelEmbed: true,
                    levelMessage: "{user} just leveled up to level **{level}**!",
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { console.log(err) });


        if (!guildDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`We added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (guildDatabase.ticketEnabled === false) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`The tickets module is disabled in this server.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const Ticket = require('../../structures/schemas/TicketSchema');
        const subCmd = interaction.options.getSubcommand();

        switch (subCmd) {
            case "create":

                let subject = interaction.options.getString("subject");
                if (!subject) subject = "No subject specified.";

                let role = interaction.guild.roles.cache.get(`${guildDatabase.ticketSupport}`);

                const openCategory = interaction.guild.channels.cache.get(`${guildDatabase.ticketCategory}`);

                if (!openCategory) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Could not find a tickets category. Configure this in our [dashboard](https://dashboard.quabot.net)!`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                let ticketId = parseInt(`${guildDatabase.ticketId}`) + 1;

                const channel = await interaction.guild.channels.create(`ticket-${ticketId}`, {
                    type: "TEXT",
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        },
                        {
                            id: interaction.user.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        },
                    ]
                });

                channel.permissionOverwrites.create(role,
                    { VIEW_CHANNEL: true, SEND_MESSAGES: true },
                );

                channel.setParent(openCategory, { lockPermissions: false });

                const embed = new MessageEmbed()
                    .setColor(color)
                    .setTitle("New Ticket")
                    .setDescription("Please wait, staff will be with you shortly.")
                    .addFields(
                        { name: "Topic", value: `${subject}`, inline: true },
                        { name: "Created By", value: `${interaction.user}`, inline: true }
                    )
                    .setTimestamp()

                channel.send({
                    embeds: [embed],
                    components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('close-ticket')
                                    .setLabel('🔒 Close')
                                    .setStyle('DANGER')
                            )
                    ],
                }).catch((err) => { });

                if (role) channel.send(`${role}`);

                const newTicket = new Ticket({
                    guildId: interaction.guild.id,
                    ticketId: ticketId,
                    channelId: channel.id,
                    topic: subject,
                    closed: false,
                    owner: interaction.user.id,
                    users: [],
                });
                await newTicket.save();

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setTitle("Ticket Created")
                            .setDescription(`Check it out here: ${channel}. Staff will be with you shortly!`)
                            .setTimestamp()
                    ]
                }).catch((err) => { });

                await guildDatabase.updateOne({
                    ticketId: ticketId,
                });

                break;

            case 'close':
                const ticketFound = await Ticket.findOne({
                    channelId: interaction.channel.id,
                }, (err, ticket) => {
                    if (err) console.error(err);
                }).clone().catch(function (err) { console.log(err) });

                if (!ticketFound) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Could not find that ticket in our records.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                let valid = false;
                if (ticketFound.owner === interaction.user.id) valid = true;
                if (ticketFound.users.includes(interaction.user.id)) valid = true;

                if (!valid) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`This is not your ticket! You must be added to the ticket to use that button.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setDescription("Close this ticket with the button below this message.")
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setStyle("SECONDARY")
                                    .setCustomId("close-ticket")
                                    .setLabel("🔒 Close")
                            )
                    ]
                }).catch((err => { }));

                break;

            case 'delete':
                const ticketFound2 = await Ticket.findOne({
                    channelId: interaction.channel.id,
                }, (err, ticket) => {
                    if (err) console.error(err);
                }).clone().catch(function (err) { console.log(err) });

                if (!ticketFound2) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Could not find that ticket in our records.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                let valid2 = false;
                if (ticketFound2.owner === interaction.user.id) valid2 = true;
                if (ticketFound2.users.includes(interaction.user.id)) valid2 = true;

                if (!valid2) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`This is not your ticket! You must be added to the ticket to use that button.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setDescription("Close this ticket with the button below this message.")
                    ], components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setStyle("SECONDARY")
                                    .setCustomId("delete-ticket")
                                    .setLabel("🗑️ Delete")
                            )
                    ]
                }).catch((err => { }));

                break;

            case 'add':
                const user = interaction.options.getUser("user");

                const ticket = await Ticket.findOne({
                    channelId: interaction.channel.id,
                }, (err, ticket) => {
                    if (err) console.error(err);
                }).clone().catch(function (err) { console.log(err) });

                if (!ticket) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Could not find that ticket in our records.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                let allowed = false;
                if (ticket.owner === interaction.user.id) allowed = true;
                if (ticket.users.includes(interaction.user.id)) allowed = true;

                if (!allowed) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`This is not your ticket! You must be added to the ticket to use that button.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                const array = ticket.users;

                array.push(user.id)

                await ticket.updateOne({
                    users: array
                });

                interaction.channel.permissionOverwrites.edit(user,
                    { VIEW_CHANNEL: true, SEND_MESSAGES: true },
                ).catch((err => { }));

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setDescription(`Added ${user} to the ticket.`)
                    ]
                }).catch((err => { }));

                break;

            case 'remove':
                const member = interaction.options.getUser("user");

                const TICKET = await Ticket.findOne({
                    channelId: interaction.channel.id,
                }, (err, ticket) => {
                    if (err) console.error(err);
                }).clone().catch(function (err) { console.log(err) });

                if (!TICKET) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Could not find that ticket in our records.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                let allowed2 = false;
                if (TICKET.owner === interaction.user.id) allowed2 = true;
                if (TICKET.users.includes(interaction.user.id)) allowed2 = true;

                if (!allowed2) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`This is not your ticket! You must be added to the ticket to use that button.`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                const users = TICKET.users;
                console.log(users)
                for (var i = 0; i < users.length; i++) {
                    if (users[i] === `${member.id}`) {
                        users.splice(i, 1);
                        i--; 
                    }
                }

                console.log(users)

                await TICKET.updateOne({
                    users: users
                });

                interaction.channel.permissionOverwrites.edit(member,
                    { VIEW_CHANNEL: false, SEND_MESSAGES: false },
                ).catch((err => { }));

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setDescription(`Removed ${member} from the ticket.`)
                    ]
                }).catch((err => { }));

                break;

        }
    }
}