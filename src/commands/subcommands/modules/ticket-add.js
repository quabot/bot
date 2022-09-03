const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const { getTicketConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');
const Ticket = require('../../../structures/schemas/TicketSchema');

module.exports = {
    name: "add",
    command: "ticket",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: false });
        const ticketConfig = await getTicketConfig(client, interaction.guildId);


        if (!ticketConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "We just created a new database record. Please run that command again.")]
        }).catch(() => null);

        if (ticketConfig.ticketEnabled === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Tickets are disabled in this server.")]
        }).catch(() => null);


        const Ticket = require('../../../structures/schemas/TicketSchema');

        const ticketFound = await Ticket.findOne({
            channelId: interaction.channel.id,
        }).clone().catch(function (err) { });

        if (!ticketFound) return interaction.editReply({
            embeds: [await generateEmbed(color, "You're not inside of a ticket!")]
        }).catch(() => null);

        let valid = false;
        if (ticketFound.owner === interaction.user.id) valid = true;
        if (ticketFound.users.includes(interaction.user.id)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;

        if (!valid) return interaction.editReply({
            embeds: [await generateEmbed(color, "You cannot manage this ticket, you must be added first.")]
        }).catch(() => null);

        const user = interaction.options.getUser("user");

        const array = ticketFound.users;

        array.push(user.id)

        await ticketFound.updateOne({
            users: array
        });

        interaction.channel.permissionOverwrites.edit(user,
            { ViewChannel: true, SendMessages: true },
        ).catch(() => null);

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`Added ${user} to the ticket.`)
            ]
        }).catch(() => null);
    }
}
