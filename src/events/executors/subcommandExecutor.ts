import { type Interaction, Colors, EmbedBuilder } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: 'interactionCreate',
  name: 'subcommandExecutor',

  async execute({ client }: EventArgs, interaction: Interaction) {
    try {
      if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    
      if (!client.isReady()) return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

      const subcommandName = interaction.options.getSubcommand();
      if (!subcommandName) return;

      const subcommand = client.subcommands.get(`${subcommandName}/${interaction.commandName}`);
      if (!subcommand)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Red)
              .setDescription(
                `⚠️ An error occurred! Couldn't find the command ${interaction.commandName} with subcommand ${subcommandName}!`,
              )
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

      
    //* If year is 2025, return a message.
    if (new Date().getFullYear() === 2025) {
      return await interaction.reply({ content: 'As of January 1, 2025, QuaBot has stopped operation. We recommend switching to [ProBot](https://probot.io). We are sorry for the inconvenience. Thank you for 3 amazing years of operations.', ephemeral: true }).catch(() => null);
    }
    if (new Date().getFullYear() === 2024) await subcommand
        .execute({ client, interaction, color })
        .catch(e => handleError(client, e, interaction, `${interaction.commandName}/${subcommandName}`));
    } catch (e) {
      return;
    }
  },
};
