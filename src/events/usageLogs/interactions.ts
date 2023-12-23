import { EmbedBuilder, type ButtonInteraction } from 'discord.js';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'buttonExecutor',
  async execute({ client }: EventArgs, interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const guild = client.guilds.cache.get(process.env.GUILD_ID!);
    if (!guild) return;
    const channel = guild?.channels.cache.get('1183481019735736440');
    if (!channel?.isTextBased()) return;

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTimestamp()
          .setDescription(`${interaction.customId} - ${interaction.user.username} - ${interaction.guild?.name}`),
      ],
    });
  },
};
