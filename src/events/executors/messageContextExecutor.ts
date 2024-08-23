import { MessageContextMenuCommandInteraction } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'userContextExecutor',

  async execute({ client }: EventArgs, interaction: MessageContextMenuCommandInteraction) {
    if (!interaction.isMessageContextMenuCommand() || !interaction.guildId || !interaction.channel) return;
    if (interaction.channel!.isDMBased()) return;
    
    if (!client.isReady()) return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

    const context = client.messageContexts.get(interaction.commandName);
    if (!context) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    await context
      .execute({ client, interaction, color })
      .catch(e => handleError(client, e, interaction, interaction.commandName));
  },
};
