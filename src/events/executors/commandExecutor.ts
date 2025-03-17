import { type Interaction, Colors, EmbedBuilder } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'commandExecutor',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    
    if (!client.isReady()) return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`⚠️ An error occurred! Couldn't find the command ${interaction.commandName}!`)
            .setTimestamp(),
        ],
      });

    const config = await getServerConfig(client, interaction.guildId);
    if (config && config.disabledCommands && config.disabledCommands.includes(interaction.commandName))
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.color ?? '#416683')
            .setDescription('That command is not enabled in this server.'),
        ],
        ephemeral: true,
      });

    const color = config?.color ?? '#416683';

    await command
      .execute({ client, interaction, color })
      .catch(e => handleError(client, e, interaction, interaction.commandName));
  },
};
