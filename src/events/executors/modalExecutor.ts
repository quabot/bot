import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';
import { type Interaction } from 'discord.js';

export default {
  event: 'interactionCreate',
  name: 'modalExecutor',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isModalSubmit() || !interaction.guildId) return;
    
    if (!client.isReady()) return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

    const modal = client.modals.get(interaction.customId);
    if (!modal) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    
    //* If year is 2025, return a message.
    if (new Date().getFullYear() === 2025) {
      return await interaction.reply({ content: 'As of January 1, 2025, QuaBot has stopped operation. We recommend switching to [ProBot](https://probot.io). We are sorry for the inconvenience. Thank you for 3 amazing years of operations.', ephemeral: true }).catch(() => null);
    }
    if (new Date().getFullYear() === 2024) await modal
      .execute({ client, interaction, color })
      .catch(e => handleError(client, e, interaction, interaction.customId));
  },
};
