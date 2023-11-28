import type { ButtonInteraction } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'buttonExecutor',
  async execute({ client }: EventArgs, interaction: ButtonInteraction) {
    if (!interaction.isButton() || !interaction.guildId) return;

    const button = client.buttons.get(interaction.customId);
    if (!button) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    await button.execute({ client, interaction, color }).catch(async e => await handleError(client, e, interaction.customId));
  },
};
