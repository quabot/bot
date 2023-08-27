const { Client, ButtonInteraction, ColorResolvable, PermissionFlagsBits } = require('discord.js');
const Ticket = require('@schemas/Ticket');
const { getIdConfig } = require('@configs/idConfig');
const { getTicketConfig } = require('@configs/ticketConfig');
const { Embed } = require('@constants/embed');

module.exports = {
  name: 'transcript-ticket',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getTicketConfig(client, interaction.guildId);
    const ids = await getIdConfig(interaction.guildId);

    if (!config || !ids)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Tickets are disabled in this server.')],
      });

    const ticket = await Ticket.findOne({
      channelId: interaction.channelId,
    });
    if (!ticket)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This is not a valid ticket.')],
      });

    if (!ticket.closed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This ticket is not closed.')],
      });

    let valid = false;
    if (ticket.owner === interaction.user.id) valid = true;
    if (ticket.users.includes(interaction.user.id)) valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;
    if (!valid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You are not allowed to request a transcript of this ticket.')],
      });

    const discordTranscripts = require('discord-html-transcripts');
    const attachment = await discordTranscripts.createTranscript(interaction.channel, {
      limit: -1,
      minify: true,
      saveImages: false,
      useCND: true,
    });

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('Ticket Transcript')
          .setDescription('The transcript is in the attachment. Open it in the browser to view it.'),
      ],
      files: [attachment],
    });
  },
};
