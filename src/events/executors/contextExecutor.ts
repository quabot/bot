import { ChannelType, type ContextMenuCommandInteraction } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'buttonExecutor',

  async execute({ client }: EventArgs, interaction: ContextMenuCommandInteraction) {
    if (interaction.channel!.type === ChannelType.DM) return;
    if (!interaction.isUserContextMenuCommand() || !interaction.guildId) return;

    const context = client.contexts.get(interaction.commandName);
    if (!context) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    await context.execute({ client, interaction, color }).catch(e => handleError(client, e, interaction.commandName));
  },
};
