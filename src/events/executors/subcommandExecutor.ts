import { type Interaction, Colors, EmbedBuilder } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import type { EventArgs } from '@typings/functionArgs';
import { handleError } from '@functions/error';

export default {
  event: 'interactionCreate',
  name: 'subcommandExecutor',

  async execute({ client }: EventArgs, interaction: Interaction) {
    try {
      if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    
      if (!client.isReady()) return await interaction.reply('QuaBot is still starting up. Please wait a few seconds and try again.').catch(() => null);

      const subcommandName = interaction.options.getSubcommand();
      if (!subcommandName) return;

      const subcommand = client.subcommands.get(`${subcommandName}/${interaction.commandName}`);
      if (!subcommand)
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Red)
              .setDescription(
                `⚠️ An error occurred! Couldn't find the \`/${interaction.commandName} ${subcommandName}\`!`,
              )
              .setTimestamp(),
          ],
        });

      const config = await getServerConfig(client, interaction.guildId);
      if (config && config.disabledCommands && config.disabledCommands.includes(`${interaction.commandName}/${subcommandName}`))
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.color ?? '#416683')
              .setDescription('That command is not enabled in this server.'),
          ],
          ephemeral: true,
        });

      const color = config?.color ?? '#416683';

      await subcommand
        .execute({ client, interaction, color })
        .catch(e => handleError(client, e, interaction, `${interaction.commandName}/${subcommandName}`));
    } catch (e) {
      return;
    }
  },
};
