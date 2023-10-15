import { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';
import { Embed } from '@constants/embed';
const { getApplicationConfig } = require('@configs/applicationConfig');
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'applications',
  name: 'apply',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const id = interaction.options.getString('id');
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

    if (!id)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please specify a valid application ID.')],
      });

    const Application = require('@schemas/Application');
    const fApplication = await Application.findOne({
      guildId: interaction.guildId,
      id,
    });

    if (!fApplication)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please specify a valid application ID.')],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `In order to fillout that application, go to our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/user/applications/form/${id}).`,
        ),
      ],
    });
  },
};
