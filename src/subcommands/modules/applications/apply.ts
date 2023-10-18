import { Embed } from '@constants/embed';
import { getApplicationConfig } from '@configs/applicationConfig';
import type { CommandArgs } from '@typings/functionArgs';
import Application from '@schemas/Application';

export default {
  parent: 'applications',
  name: 'apply',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const id = interaction.options.getString('id');
    const config = await getApplicationConfig(interaction.guildId!, client);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This module is disabled in this server.')],
      });

    if (!id)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please specify a valid application ID.')],
      });

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
