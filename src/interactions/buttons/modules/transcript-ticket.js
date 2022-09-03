const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const Ticket = require('../../../structures/schemas/TicketSchema');
const { getTicketConfig } = require('../../../structures/functions/config');

module.exports = {
    id: "transcript-ticket",
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

        const channel = interaction.guild.channels.cache.get(`${ticketFound.channelId}`);
        if (!channel) return interaction.editReply({
            embeds: [await generateEmbed(color, "Couldn't find the ticket channel; this shouldn't be possible. Please make a new ticket or [contact our support](https://discord.quabot.net).")]
        }).catch(() => null);

        const discordTranscripts = require('discord-html-transcripts');
        const attachment = await discordTranscripts.createTranscript(channel);

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("This ticket transcript is in the attachment. Open it in the browser to see it.")
            ],
            files: [attachment]
        }).catch((err => { console.error(err) }));
    }
}
