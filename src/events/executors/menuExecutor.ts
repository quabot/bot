import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';
import { type Interaction } from 'discord.js';

export default {
  event: 'interactionCreate',
  name: 'menuExecutor',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isAnySelectMenu() || !interaction.guildId) return;
    
    if (!client.isReady()) return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

    const menu = client.menus.get(interaction.customId);
    if (!menu) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    await menu
      .execute({ client, interaction, color })
      .catch((e: any) => handleError(client, e, interaction, interaction.customId));
  },
};
