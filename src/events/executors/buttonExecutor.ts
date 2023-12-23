import { EmbedBuilder, type Interaction } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'buttonExecutor',
  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isButton() || !interaction.guildId) return;

    const button = client.buttons.get(interaction.customId);
    if (!button) return;

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

    await button
      .execute({ client, interaction, color })
      .catch(async e => await handleError(client, e, interaction, interaction.customId));
  },
};
