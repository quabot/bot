const {
  Client,
  ButtonInteraction,
  ColorResolvable,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require('discord.js');
const Ticket = require('@schemas/Ticket');
const { getIdConfig } = require('@configs/idConfig');
const { getTicketConfig } = require('@configs/ticketConfig');
const { Embed } = require('@constants/embed');

module.exports = {
  name: 'confirm-delete-ticket',
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
        embeds: [new Embed(color).setDescription('You are not allowed to delete the ticket.')],
      });

    await interaction.message.edit({
      embeds: [
        new Embed(color)
          .setTitle('Are you sure you want to delete the ticket?')
          .setDescription("This cannot be undone. Click 'Confirm' to delete it."),
      ],
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('cancel-delete-ticket')
              .setLabel('❌ Cancel')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId('confirm-delete-ticket')
              .setLabel('✅ Confirm')
              .setStyle(ButtonStyle.Success)
              .setDisabled(true),
          ),
      ],
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Deleting the ticket.')],
    });

    const discordTranscripts = require('discord-html-transcripts');
    const attachment = await discordTranscripts.createTranscript(interaction.channel, {
      limit: -1,
      minify: true,
      saveImages: false,
      useCND: true,
    });

    const logChannel = interaction.guild.channels.cache.get(config.logChannel);
    if (logChannel && config.logEnabled)
      await logChannel.send({
        embeds: [
          new Embed(color)
            .setTitle('Ticket Deleted')
            .setDescription('Ticket transcript added as attachment.')
            .addFields(
              { name: 'Ticket Owner', value: `<@${ticket.owner}>`, inline: true },
              { name: 'Channel', value: `${interaction.channel}`, inline: true },
              { name: 'Deleted By', value: `${interaction.user}`, inline: true },
            )
            .setFooter({ text: `ID: ${ticket.id}` }),
        ],
        files: [attachment],
      });

    await interaction.channel.delete();

    await Ticket.findOneAndDelete({
      id: ticket.id,
      guildId: interaction.guildId,
    });
  },
};
