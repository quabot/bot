const { Client, ButtonInteraction, ColorResolvable, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const Ticket = require("../../../structures/schemas/Ticket");
const { getIdConfig } = require("../../../utils/configs/idConfig");
const { getTicketConfig } = require("../../../utils/configs/ticketConfig");
const { Embed } = require("../../../utils/constants/embed");

module.exports = {
    name: 'delete-ticket',
    /**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: false });

        const config = await getTicketConfig(client, interaction.guildId);
        const ids = await getIdConfig(interaction.guildId);

        if (!config || !ids) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
            ]
        });

        if (!config.enabled) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Tickets are disabled in this server.')
            ]
        });

        const ticket = await Ticket.findOne({
            channelId: interaction.channelId
        });
        if (!ticket) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('This is not a valid ticket.')
            ]
        });

        if (!ticket.closed) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('This ticket is not closed.')
            ]
        });


        let valid = false;
        if (ticket.owner === interaction.user.id) valid = true;
        if (ticket.users.includes(interaction.user.id)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;
        if (!valid) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('You are not allowed to delete the ticket.')
            ]
        });


        await interaction
            .editReply({
                embeds: [
                    new Embed(color)
                        .setTitle('Are you sure you want to delete the ticket?')
                        .setDescription('This cannot be undone. Click \'Confirm\' to delete it.'),
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('cancel-delete-ticket')
                                .setLabel('❌ Cancel')
                                .setStyle(ButtonStyle.Danger)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('confirm-delete-ticket')
                                .setLabel('✅ Confirm')
                                .setStyle(ButtonStyle.Success)
                        )
                ],
            });
    },
};