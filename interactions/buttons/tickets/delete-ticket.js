const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');

// delete ticket
module.exports = {
    id: "delete-ticket",
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
        const ticketFound = await Ticket.findOne({
            channelId: interaction.message.channel.id,
        }, (err, ticket) => {
            if (err) console.error(err);
        }).clone().catch(function (err) {  });

        if (!ticketFound) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Could not find that ticket in our records.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        let valid = false;
        if (ticketFound.owner === interaction.user.id) valid = true;
        if (ticketFound.users.includes(interaction.user.id)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;

        if (!valid) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`This is not your ticket! You must be added to the ticket to use that button.`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Could not find that channel. This is a bug. Please make a new ticket.")
            ]
        }).catch((err => { }));

        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Are you sure you want to delete this ticket?")
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('cancel-ticket')
                            .setLabel('🚫 Cancel')
                            .setStyle(ButtonStyle.Danger)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm-ticket')
                            .setLabel('✅ Confirm')
                            .setStyle(ButtonStyle.Success)
                    )
            ], fetchReply: true
        }).catch((err => { }));

        if (!msg) return;
        const collectorRepeat = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

        collectorRepeat.on('collect', async interaction => {
            if (interaction.customId === "cancel-ticket") {

                interaction.message.edit({
                    components: [new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('cancel-ticket')
                                .setLabel('🚫 Cancel')
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('confirm-ticket')
                                .setLabel('✅ Confirm')
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true)
                        )
                ]
                })
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setDescription("Cancelled the ticket deletion.")
                    ]
                }).catch((err => { }));

                return;

            }
            if (interaction.customId === "confirm-ticket") {

                const discordTranscripts = require('discord-html-transcripts');
                const attachment = await discordTranscripts.createTranscript(channel, {
                    limit: -1,
                    minify: true,
                    saveImages: false,
                    useCND: true
                });


                await Ticket.findOneAndDelete({
                    channelId: interaction.message.channel.id,
                }, (err, ticket) => {
                    if (err) console.log(err);
                }).clone().catch(function (err) {  });

                channel.delete();

                const logChannel = interaction.guild.channels.cache.get(`${ticketConfigDatabase.ticketChannelID}`);
                if (!logChannel) return;
                if (ticketConfigDatabase.ticketLogs === false) return;
                const embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Ticket Deleted")
                    .setDescription("Ticket transcript added as attachment.")
                    .addFields(
                        { name: "User", value: `${interaction.user}`, inline: true },
                        { name: "Channel", value: `#${interaction.channel.name}`, inline: true }
                    );

                logChannel.send({ embeds: [embed], files: [attachment] }).catch((err => { }));

            }
        });
    }
}
