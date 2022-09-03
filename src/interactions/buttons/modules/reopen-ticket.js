const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const Ticket = require('../../../structures/schemas/TicketSchema');
const { getTicketConfig } = require('../../../structures/functions/config');

module.exports = {
    id: "reopen-ticket",
    /**
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
    async execute(client, interaction, color) {

        const ticketConfig = await getTicketConfig(client, interaction.guildId);
        await interaction.deferReply().catch(() => null);


        if (!ticketConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "We just created a new database record. Please click that button again.")]
        }).catch(() => null);

        if (ticketConfig.ticketEnabled === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Tickets are disabled in this server.")]
        }).catch(() => null);

        const ticketFound = await Ticket.findOne({
            channelId: interaction.message.channel.id,
        }).clone().catch(function (err) { });

        if (!ticketFound) return interaction.editReply({
            embeds: [await generateEmbed(color, "You are not inside of an existing ticket.")]
        }).catch(() => null);;

        let valid = false;
        if (ticketFound.owner === interaction.user.id) valid = true;
        if (ticketFound.users.includes(interaction.user.id)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;

        if (!valid) return interaction.editReply({
            embeds: [await generateEmbed(color, "You cannot manage this ticket. You must be added first.")]
        }).catch(() => null);


        const openCategory = interaction.guild.channels.cache.get(`${ticketConfig.ticketCategory}`);

        if (!openCategory) return interaction.editReply({
            embeds: [await generateEmbed(color, "Couldn't find the Tickets category. Configure this on [our dashboard](https://dashboard.quabot.net).")]
        }).catch(() => null);

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel) return interaction.editReply({
            embeds: [await generateEmbed(color, "Couldn't find the ticket channel; this shouldn't be possible. Please make a new ticket or [contact our support](https://discord.quabot.net).")]
        }).catch(() => null);

        channel.setParent(openCategory, { lockPermissions: false }).catch(() => null);

        channel.permissionOverwrites.edit(ticketFound.owner,
            { ViewChannel: true, SendMessages: true },
        ).catch(() => null);

        ticketFound.users.forEach(user => {
            channel.permissionOverwrites.edit(user,
                { ViewChannel: true, SendMessages: true },
            ).catch(() => null);
        });

        interaction.message.edit({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('reopen-ticket')
                            .setLabel('🔓 Reopen')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('delete-ticket')
                            .setLabel('🗑️ Delete')
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('transcript-ticket')
                            .setLabel('📝 Transcipt')
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true)
                    )
            ],
        }).catch(() => null);

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Ticket Re-Opened!")
                    .setDescription("Close the ticket with the button below this message")
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close-ticket')
                            .setLabel('🔒 Close')
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        }).catch((err => { console.error(err) }));

        await ticketFound.updateOne({
            closed: false,
        });

        const logChannel = interaction.guild.channels.cache.get(`${ticketConfig.ticketChannelID}`);
        if (logChannel && ticketConfig.ticketLogs === true) logChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Ticket Reopened")
                    .addFields(
                        { name: "Reopened By", value: `${interaction.user}`, inline: true },
                        { name: "Channel", value: `${interaction.channel} (#${interaction.channel.name})`, inline: true }
                    )
            ]
        }).catch(() => null);
    }
}
