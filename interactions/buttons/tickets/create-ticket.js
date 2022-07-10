const { MessageEmbed, MessageActionRow, Modal, TextInputComponent, MessageButton, GuildScheduledEvent } = require('discord.js');

const { createTicket } = require('../../../commands/systems/ticket/create');

// create ticket
module.exports = {
    id: "create-ticket",
    async execute(interaction, client, color) {

        const TicketConfig = require('../../../structures/schemas/TicketConfigSchema');
        const ticketConfigDatabase = await TicketConfig.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newTicketConfig = new TicketConfig({
                    guildId: interaction.guild.id,
                    ticketCategory: "none",
                    ticketClosedCategory: "none",
                    ticketEnabled: true,
                    ticketStaffPing: true,
                    ticketTopicButton: true,
                    ticketSupport: "none",
                    ticketId: 1,
                    ticketLogs: true,
                    ticketChannelID: "none",
                })
                newTicketConfig.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { });


        if (!ticketConfigDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`We added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (ticketConfigDatabase.ticketEnabled === false) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`The tickets module is disabled in this server.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (ticketConfigDatabase.ticketTopicButton === false) {
            createTicket(ticketConfigDatabase, interaction);
        } else {
            const modal = new Modal()
                .setCustomId('ticket')
                .setTitle('Create a ticket')
                .addComponents(
                    new MessageActionRow()
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('ticket-topic')
                                .setLabel('Ticket Topic')
                                .setStyle('SHORT')
                                .setMinLength(1)
                                .setMaxLength(300)
                                .setPlaceholder('I have a question about...')
                                .setRequired(true)
                        )
                );

            await interaction.showModal(modal);
        }

        const Ticket = require('../../../structures/schemas/TicketSchema');

        async function createTicket(ticketConfigDatabase, interaction) {
            let subject = "No subject specified.";

            let role = interaction.guild.roles.cache.get(`${ticketConfigDatabase.ticketSupport}`);

            const openCategory = interaction.guild.channels.cache.get(`${ticketConfigDatabase.ticketCategory}`);

            if (!openCategory) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Could not find a tickets category. Configure this in our [dashboard](https://dashboard.quabot.net)!`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));

            let ticketId = parseInt(`${ticketConfigDatabase.ticketId}`) + 1;

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
                ], ephemeral: true
            }).catch((err) => { });

            await ticketConfigDatabase.updateOne({
                ticketId: ticketId,
            });
        }

    }
}