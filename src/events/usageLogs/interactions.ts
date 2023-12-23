import { EmbedBuilder, type Interaction } from 'discord.js';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'interactionUsage',
  async execute({ client }: EventArgs, interaction: Interaction) {
    let location =
      interaction.isCommand() || interaction.isAutocomplete() ? interaction.commandName : interaction.customId;

    if (interaction.isChatInputCommand()) {
      const subcommand = interaction.options.getSubcommand();
      if (subcommand) location += `/${subcommand}`;
    }

    const guild = client.guilds.cache.get(process.env.GUILD_ID!);
    if (!guild) return;
    const channel = guild?.channels.cache.get('1183481019735736440');
    if (!channel?.isTextBased()) return;

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTimestamp()
          .setDescription(`${location} - ${interaction.user.username} - ${interaction.guild?.name}`),
      ],
    });
  },
};
