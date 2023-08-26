const { Client, Interaction } = require('discord.js');
const { getServerConfig } = require('@configs/serverConfig');
const { handleError } = require('@constants/errorHandler');

module.exports = {
  event: 'interactionCreate',
  name: 'modalExecutor',
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isModalSubmit() || !interaction.guildId) return;

    const modal = client.modals.get(interaction.customId);
    if (!modal) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    modal.execute(client, interaction, color).catch(e => handleError(client, e, interaction.customId));
  },
};
