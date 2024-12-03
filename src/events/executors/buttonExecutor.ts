import { type Interaction } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'buttonExecutor',
  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isButton()) return;
    
    if (!client.isReady()) return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

    let button = client.buttons.get(interaction.customId);
    if (interaction.customId.startsWith('reaction-roles-') && !interaction.customId.includes('dropdown')) button = client.buttons.get('reaction-roles');
    if (!button) return;

    const config = await getServerConfig(client, interaction.guildId ?? "none");
    const color = config?.color ?? '#416683';

    //* If year is 2025, return a message.
    if (new Date().getFullYear() === 2025) {
      return await interaction.reply({ content: 'As of January 1, 2025, QuaBot has stopped operation. We recommend switching to [ProBot](https://probot.io). We are sorry for the inconvenience. Thank you for 3 amazing years of operations.', ephemeral: true }).catch(() => null);
    }
    if (new Date().getFullYear() === 2024) await button
      .execute({ client, interaction, color })
      .catch(async e => await handleError(client, e, interaction, interaction.customId));
  },
};
