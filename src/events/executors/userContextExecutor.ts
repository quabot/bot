import { type ContextMenuCommandInteraction } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'userContextExecutor',

  async execute({ client }: EventArgs, interaction: ContextMenuCommandInteraction) {
    if (!interaction.isUserContextMenuCommand() || !interaction.guildId || !interaction.channel) return;
    if (interaction.channel!.isDMBased()) return;

    if (!client.isReady())
      return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

    const context = client.userContexts.get(interaction.commandName);
    if (!context) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    //* If year is 2025, return a message.
    if (new Date().getFullYear() === 2025) {
      return await interaction
        .reply({
          content:
            'As of January 1, 2025, QuaBot has stopped operation. We recommend switching to [ProBot](https://probot.io). We are sorry for the inconvenience. Thank you for 3 amazing years of operations.',
          ephemeral: true,
        })
        .catch(() => null);
    }
    if (new Date().getFullYear() === 2024)
      await context
        .execute({ client, interaction, color })
        .catch(e => handleError(client, e, interaction, interaction.commandName));
  },
};
