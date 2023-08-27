const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('@constants/embed');

module.exports = {
  parent: 'role',
  name: 'delete',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.options.getRole('role');

    await interaction.guild.roles.delete(role.id, `Role deleted by ${interaction.user.username}`).catch(async e => {});

    await interaction.editReply({
      embeds: [new Embed(role.color ?? color).setDescription('Deleted the role.')],
    });
  },
};
