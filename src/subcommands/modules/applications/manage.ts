import { Embed } from '@constants/embed';
import { getApplicationConfig } from '@configs/applicationConfig';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'applications',
  name: 'manage',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getApplicationConfig(interaction.guildId!, client);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
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
