import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';
import type { AnySelectMenuInteraction } from 'discord.js';

export default {
  event: 'interactionCreate',
  name: 'menuExecutor',

  async execute({ client }: EventArgs, interaction: AnySelectMenuInteraction) {
    if (!interaction.isStringSelectMenu() || !interaction.guildId) return;

    const menu = client.menus.get(interaction.customId);
    if (!menu) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    await menu.execute({ client, interaction, color }).catch((e: any) => handleError(client, e, interaction.customId));
  },
};
