import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';
import { EmbedBuilder, type Interaction } from 'discord.js';

export default {
  event: 'interactionCreate',
  name: 'menuExecutor',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isAnySelectMenu() || !interaction.guildId) return;

    const menu = client.menus.get(interaction.customId);
    if (!menu) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    const guild = client.guilds.cache.get(process.env.GUILD_ID!);
    if (!guild) return;
    const channel = guild?.channels.cache.get('1183481019735736440');
    if (!channel) return;

    // @ts-ignore
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTimestamp()
          .setDescription(`${interaction.customId} - ${interaction.user.username} - ${interaction.guild?.name}`),
      ],
    });

    await menu
      .execute({ client, interaction, color })
      .catch((e: any) => handleError(client, e, interaction, interaction.customId));
  },
};
