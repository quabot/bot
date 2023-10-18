import { Embed } from '@constants/embed';
import { getApplicationConfig } from '@configs/applicationConfig';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'applications',
  name: 'help',

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
        new Embed(color)
          .setTitle('What is the Applications module and how do i use it?')
          .setDescription(
            `The Applications module is like google forms, but on Discord. This module is still in beta and can change at all times. Staff can create custom forms with custom questions that users can then answer (Discord fillout soon). The staff can then view the answers and decide if the user is accepted or not. We recommend you to use this module from [our dashboard](https://quabot.net/dashboard/${interaction.guildId}/user/applications).`,
          ),
      ],
    });
  },
};
