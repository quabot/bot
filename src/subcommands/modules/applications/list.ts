import { Embed } from '@constants/embed';
import { getApplicationConfig } from '@configs/applicationConfig';
import type { CommandArgs } from '@typings/functionArgs';
import Application from '@schemas/ApplicationForm';

export default {
  parent: 'applications',
  name: 'list',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getApplicationConfig(interaction.guildId!, client);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This module is disabled in this server.')],
      });

    const applications = await Application.find({
      guildId: interaction.guildId,
    });

    if (applications.length < 1)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This server has no applications.')],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color).setFields(
          ...applications.map(({ name, description }) => {
            return {
              name: name.slice(0, 256),
              value: description?.slice(0, 1024) ?? 'No description',
            };
          }),
        ),
      ],
    });
  },
};
