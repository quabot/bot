const {
  Client,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} = require("discord.js");
const { getSuggestConfig } = require("@configs/suggestConfig");
const { Embed } = require("@constants/embed");
const Suggest = require("@schemas/Suggestion");
const { CustomEmbed } = require("@constants/customEmbed");

module.exports = {
  parent: "suggestion",
  name: "deny",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    const id = interaction.options.getNumber("suggestion-id");
    const suggestion = await Suggest.findOne({
      guildId: interaction.guildId,
      id: id,
    });

    const config = await getSuggestConfig(client, interaction.guildId);
    if (!config)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "We just created a new document! Could you please run that command again?",
          ),
        ],
        ephemeral: true,
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "Suggestions are disabled in this server!",
          ),
        ],
        ephemeral: true,
      });

    if (!suggestion)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription("Couldn't find the suggestion."),
        ],
        ephemeral: true,
      });

    if (suggestion.status === "denied")
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "The suggestion has already been denied.",
          ),
        ],
      });

    const channel = interaction.guild.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "Couldn't find the suggestions channel.",
          ),
        ],
        ephemeral: true,
      });

    await channel.messages.fetch(suggestion.msgId).then(async (message) => {
      if (!message)
        return interaction.reply({
          embeds: [
            new Embed(color).setDescription(
              "Couldn't find the suggestion! Are you sure it wasn't deleted?",
            ),
          ],
          ephemeral: true,
        });

      let rejectionReason = "No reason specified";
      if (config.reasonRequired) {
        const modal = new ModalBuilder()
          .setTitle("Reason for rejecting")
          .setCustomId("reject-suggest")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Rejection Reason")
                .setMaxLength(500)
                .setMinLength(2)
                .setPlaceholder("Leave a rejection reason...")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph),
            ),
          );

        await interaction.showModal(modal);

        const modalResponse = await interaction
          .awaitModalSubmit({
            time: 60000,
            filter: (i) => i.user.id === interaction.user.id,
          })
          .catch(() => {});

        if (modalResponse && modalResponse.customId === "reject-suggest")
          rejectionReason = modalResponse.fields.getTextInputValue("reason");

        if (!modalResponse) return;

        await modalResponse.reply({
          embeds: [new Embed(color).setDescription("Suggestion denied.")],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [new Embed(color).setDescription("Suggestion denied.")],
        });
      }

      suggestion.status = "denied";
      await suggestion.save();

      message.edit({
        embeds: [
          EmbedBuilder.from(message.embeds[0])
            .setColor(Colors.Red)
            .addFields(
              { name: "Denied by", value: `${interaction.user}`, inline: true },
              { name: "Reason", value: `${rejectionReason}`, inline: true },
            )
            .setFooter({ text: "This suggestion was denied!" }),
        ],
      });

      if (!config.dm) return;

      const user = interaction.guild?.members.cache.get(`${suggestion.userId}`);
      const parseString = (text) =>
        text
          .replaceAll("{suggestion}", suggestion.suggestion)
          .replaceAll("{user}", `${user}`)
          .replaceAll("{avatar}", user.displayAvatarURL() ?? "")
          .replaceAll("{server}", interaction.guild?.name ?? "")
          .replaceAll("{staff}", `${interaction.user ?? ""}`)
          .replaceAll("{state}", "denied")
          .replaceAll("{color}", color)
          .replaceAll("{icon}", interaction.guild?.iconURL() ?? "");

      const embed = new CustomEmbed(config.dmMessage, parseString).addFields(
        { name: "Denied by", value: `${interaction.user}`, inline: true },
        { name: "Reason", value: `${rejectionReason}`, inline: true },
      );
      user.send({
        embeds: [embed],
        content: parseString(config.dmMessage.content),
      });
    });
  },
};
