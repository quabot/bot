const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionOverwrites, Permissions, Message, MessageManager, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    name: "create",
    command: "ticket",
    async execute(client, interaction, color) {

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
                        interaction.channel.send({ embeds: [new EmbedBuilder().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                    });
            }
        }).clone().catch(function (err) { });


        if (!ticketConfigDatabase) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`We added this server to the database! Please run that command again.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (ticketConfigDatabase.ticketEnabled === false) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`The tickets module is disabled in this server.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));
        
        const Ticket = require('../../../structures/schemas/TicketSchema');

        async function createTicket(ticketConfigDatabase, interaction, topic) {
            let subject = topic;
            if (!subject) subject = "No subject specified.";

            let role = interaction.guild.roles.cache.get(`${ticketConfigDatabase.ticketSupport}`);

            const openCategory = interaction.guild.channels.cache.get(`${ticketConfigDatabase.ticketCategory}`);

            if (!openCategory) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Could not find a tickets category. Configure this in our [dashboard](https://dashboard.quabot.net)!`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));

            let ticketId = parseInt(`${ticketConfigDatabase.ticketId}`) + 1;

            const channel = await interaction.guild.channels.create({
                name: `ticket-${ticketId}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    },
                ]
            });

            channel.permissionOverwrites.create(role,
                { ViewChannel: true, SendMessages: true },
            );

            channel.setParent(openCategory, { lockPermissions: false });

            const embed = new EmbedBuilder()
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
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('close-ticket')
                                .setLabel('🔒 Close')
                                .setStyle(ButtonStyle.Danger)
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
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle("Ticket Created")
                        .setDescription(`Check it out here: ${channel}. Staff will be with you shortly!`)
                        .setTimestamp()
                ]
            }).catch((err) => { });

            await ticketConfigDatabase.updateOne({
                ticketId: ticketId,
            });
        }

        createTicket(ticketConfigDatabase, interaction, interaction.options.getString("topic"));

        module.exports = { createTicket };


    }
}
