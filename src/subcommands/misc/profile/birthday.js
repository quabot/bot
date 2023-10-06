const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('@constants/embed');
const { getUserGame } = require('@configs/userGame');
const Level = require('@schemas/Level');

module.exports = {
  parent: 'profile',
  name: 'birthday',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply();

    const userSchema = await getUserGame(interaction.user.id);
    if (!userSchema)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
      });

    const day = interaction.options.getNumber('day');
    const month = interaction.options.getNumber('month');
    const year = interaction.options.getNumber('year');
    if (day === undefined || month === undefined || year === undefined)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please fill out all the fields.')],
      });
    if (day < 0 || day > 31 || month < 0 || month > 12 || year < 1900 || year > new Date().getFullYear())
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid birthday.')],
      });

    userSchema.birthday = {
      configured: true,
      day,
      month,
      year,
    };
    await userSchema.save();

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Updated your birthday!')],
    });
  },
};
