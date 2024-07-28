import { type Interaction } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'buttonExecutor',
  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isButton() || !interaction.guildId) return;
    
    if (!client.isReady()) return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

    let button = client.buttons.get(interaction.customId);
    if (interaction.customId.startsWith('reaction-roles-')) button = client.buttons.get('reaction-roles');
    if (!button) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    await button
      .execute({ client, interaction, color })
      .catch(async e => await handleError(client, e, interaction, interaction.customId));
  },
};
