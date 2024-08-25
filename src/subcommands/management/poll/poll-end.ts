import Poll from '@schemas/Poll';
import { getPollConfig } from '@configs/pollConfig';
import { Embed } from '@constants/embed';
import { endPoll } from '@functions/poll';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'poll',
  name: 'end',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getPollConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Polls are not enabled in this server.')],
      });

    const id = interaction.options.getNumber('poll-id');

    if (id === undefined || id === null)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter all the required fields.')],
      });

    const poll = await Poll.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!poll)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription("Please give a valid poll-id of a poll that hasn't already been ended."),
        ],
      });

    await endPoll(client, poll, true);

    await interaction.editReply({ embeds: [new Embed(color).setDescription("The poll has been ended!")] });
  },
};
