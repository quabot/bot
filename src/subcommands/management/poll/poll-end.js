const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const ms = require("ms");
const Poll = require("@schemas/Poll");
const { getIdConfig } = require("@configs/idConfig");
const { getPollConfig } = require("@configs/pollConfig");
const { Embed } = require("@constants/embed");
const { endPoll } = require("../../../utils/functions/poll");

module.exports = {
  parent: "poll",
  name: "end",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getPollConfig(client, interaction.guildId);
    if (!config.enabled)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "Polls are not enabled in this server.",
          ),
        ],
      });

    const id = interaction.options.getNumber("poll-id");

    if (id === undefined || id === null)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "Please enter all the required fields.",
          ),
        ],
      });

    const poll = await Poll.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!poll)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription("Please give a valid poll-id."),
        ],
      });

    await endPoll(client, poll);
  },
};
