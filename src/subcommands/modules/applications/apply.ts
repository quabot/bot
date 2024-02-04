import { Embed } from '@constants/embed';
import { getApplicationConfig } from '@configs/applicationConfig';
import type { CommandArgs } from '@typings/functionArgs';
import Application from '@schemas/Application';
import { ActionRowBuilder, APISelectMenuOption, StringSelectMenuBuilder } from 'discord.js';

export default {
  parent: 'applications',
  name: 'apply',

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
      embeds: [new Embed(color).setDescription("Choose the application that you'd like to apply for.")],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder('Very cool moderator')
            .setOptions(
              applications.map(application => {
                const option: APISelectMenuOption = {
                  label: application.name.slice(0, 100),
                  value: application.id.slice(0, 100),
                };

                if (application.description)
                  option.description = application.description.replace('\n', '').slice(0, 100);

                return option;
              }),
            )
            .setCustomId('applications-apply'),
        ),
      ],
    });
  },
};
