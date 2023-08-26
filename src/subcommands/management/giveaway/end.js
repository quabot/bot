const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType } = require('discord.js');
const { getGiveawayConfig } = require('@configs/giveawayConfig');
const { Embed } = require('@constants/embed');
const Giveaway = require('@schemas/Giveaway');
const { endGiveaway } = require('../../../utils/functions/giveaway');

module.exports = {
  parent: 'giveaway',
  name: 'end',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getGiveawayConfig(client, interaction.guildId);

    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Giveaways are disabled in this server.')],
      });

    const id = interaction.options.getNumber('giveaway-id');
    if (id === null || id === undefined)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid id to end.')],
      });

    const giveaway = await Giveaway.findOne({ guildId: interaction.guildId, id });
    if (!giveaway)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the giveaway!")],
      });

    await endGiveaway(client, giveaway, true);

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Ended the giveaway!')],
    });
  },
};
