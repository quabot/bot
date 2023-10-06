const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('@constants/embed');

module.exports = {
  parent: 'punishments',
  name: 'help',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: false });

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle('What is the Punishments module and how do i use it?')
          .setDescription(`The punishments module is a way for you to moderate your server. You can warn, ban, kick or timeout users. Warns are a general warning, timeouts mute a user, kick and ban speak for themselves. If enabled, users will receive a DM when they get punished. A full list of commands:
					\`/ban\` - Ban a user.
					\`/kick\` - Kick a user.
					\`/punishments\` - Manage punishments.
					\`/tempban\` - Temporarily ban a user.
					\`timeout\` - Timeout a user.
					\`/unban\` - Unban a user.
					\`/untimeout\` - Remove the timeout from a user.
					\`/warn\` - Warn a user.`),
      ],
    });
  },
};
