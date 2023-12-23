import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';
import { type Interaction } from 'discord.js';

export default {
  event: 'interactionCreate',
  name: 'modalExecutor',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isModalSubmit() || !interaction.guildId) return;

    const modal = client.modals.get(interaction.customId);
    if (!modal) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    await modal
      .execute({ client, interaction, color })
      .catch(e => handleError(client, e, interaction, interaction.customId));
  },
};
