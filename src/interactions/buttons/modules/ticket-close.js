const {
  Client,
  ButtonInteraction,
  ColorResolvable,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const Ticket = require("@schemas/Ticket");
const { getIdConfig } = require("@configs/idConfig");
const { getTicketConfig } = require("@configs/ticketConfig");
const { Embed } = require("@constants/embed");

module.exports = {
  name: "close-ticket",
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
        embeds: [
          new Embed(color).setDescription(
            "Tickets are disabled in this server.",
          ),
        ],
      });

    const ticket = await Ticket.findOne({
      channelId: interaction.channelId,
    });
    if (!ticket)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription("This is not a valid ticket."),
        ],
      });

    if (ticket.closed)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription("This ticket is already closed."),
        ],
      });

    let valid = false;
    if (ticket.owner === interaction.user.id) valid = true;
    if (ticket.users.includes(interaction.user.id)) valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator))
      valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
      valid = true;
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
      valid = true;
    if (!valid)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "You are not allowed to close the ticket.",
          ),
        ],
      });

    const closedCategory = interaction.guild.channels.cache.get(
      config.closedCategory,
    );
    if (!closedCategory)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "There is no category to move this ticket to once closed. Configure this on our [dashboard](https://quabot.net/dashboard).",
          ),
        ],
      });

    await interaction.channel.setParent(closedCategory, {
      lockPermissions: false,
    });

    await interaction.channel.permissionOverwrites.edit(ticket.owner, {
      ViewChannel: true,
      SendMessages: false,
    });
    ticket.users.forEach(async (user) => {
      await interaction.channel.permissionOverwrites.edit(user, {
        ViewChannel: true,
        SendMessages: false,
      });
    });

    await interaction.message.edit({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close-ticket")
            .setLabel("🔒 Close")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        ),
      ],
    });

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle("Ticket Closed")
          .setDescription(
            "Reopen, delete or get a transcript with the buttons below this message.",
          ),
      ],
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("reopen-ticket")
              .setLabel("🔓 Reopen")
              .setStyle(ButtonStyle.Primary),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId("delete-ticket")
              .setLabel("🗑️ Delete")
              .setStyle(ButtonStyle.Danger),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId("transcript-ticket")
              .setLabel("📝 Transcript")
              .setStyle(ButtonStyle.Success),
          ),
      ],
    });

    ticket.closed = true;
    await ticket.save();

    const discordTranscripts = require("discord-html-transcripts");
    const attachment = await discordTranscripts.createTranscript(
      interaction.channel,
      {
        limit: -1,
        minify: true,
        saveImages: false,
        useCND: true,
      },
    );

    const logChannel = interaction.guild.channels.cache.get(config.logChannel);
    if (logChannel && config.logEnabled)
      await logChannel.send({
        embeds: [
          new Embed(color)
            .setTitle("Ticket Closed")
            .setDescription("Ticket transcript added as attachment.")
            .addFields(
              {
                name: "Ticket Owner",
                value: `<@${ticket.owner}>`,
                inline: true,
              },
              {
                name: "Channel",
                value: `${interaction.channel}`,
                inline: true,
              },
              { name: "Closed By", value: `${interaction.user}`, inline: true },
            )
            .setFooter({ text: `ID: ${ticket.id}` }),
        ],
        files: [attachment],
      });
  },
};
