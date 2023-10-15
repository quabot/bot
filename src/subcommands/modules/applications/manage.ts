import { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';
import { Embed } from '@constants/embed';
const { getApplicationConfig } = require('@configs/applicationConfig');
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'applications',
  name: 'help',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getApplicationConfig(interaction.guildId, client);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This module is disabled in this server.')],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `In order to manage applications, please go to our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/modules/applications).`,
        ),
      ],
    });
  },
};
