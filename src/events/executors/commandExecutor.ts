import { type Interaction, Colors, EmbedBuilder } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { handleError } from '@constants/errorHandler';
import type { EventArgs } from '@typings/functionArgs';

const passedUserIds: string[] = [];
export default {
  event: 'interactionCreate',
  name: 'commandExecutor',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;

    if (!client.isReady())
      return await interaction.reply('QuaBot is starting. Please wait a few seconds and try again.').catch(() => null);

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

    //* If the user's userID is not in the passedUserIds array, add it to the array, but before that, send a message (with a return)
    if (!passedUserIds.includes(`${interaction.user.id}`)) {
      passedUserIds.push(`${interaction.user.id}`);
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription('### QuaBot is shutting down on January 1, 2025.\nDear users, QuaBot is shutting down after 3 years. We recommend switching to [ProBot](https://probot.io), and recommend switching soon. Thank you for 3 amazing years of operations. Read the full announcement [here](https://quabot.net/news/shutdown-2024).\n-# This message will only show up once. Re-run the command and the message will not show up again.'),
        ],
        ephemeral: false,
      });
    }

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
      return await interaction
        .reply({
          content:
            'As of January 1, 2025, QuaBot has stopped operation. We recommend switching to [ProBot](https://probot.io). We are sorry for the inconvenience. Thank you for 3 amazing years of operations.',
          ephemeral: true,
        })
        .catch(() => null);
    }
    if (new Date().getFullYear() === 2024)
      await command
        .execute({ client, interaction, color })
        .catch(e => handleError(client, e, interaction, interaction.commandName));
  },
};
