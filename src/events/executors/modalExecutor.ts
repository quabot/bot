import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';
import { EmbedBuilder, type ModalSubmitInteraction } from 'discord.js';

export default {
  event: 'interactionCreate',
  name: 'modalExecutor',

  async execute({ client }: EventArgs, interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit() || !interaction.guildId) return;

    const modal = client.modals.get(interaction.customId);
    if (!modal) return;

    const config = await getServerConfig(client, interaction.guildId);
    const color = config?.color ?? '#416683';

    const guild = client.guilds.cache.get(process.env.GUILD_ID!);
    if (!guild) return;
    const channel = guild?.channels.cache.get("1183481019735736440");
    if (!channel) return;

    // @ts-ignore
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTimestamp()
          .setDescription(`${interaction.customId} - ${interaction.user.username} - ${interaction.guild?.name}`),
      ],
    });

    await modal.execute({ client, interaction, color }).catch(e => handleError(client, e, interaction.customId));
  },
};
