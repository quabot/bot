import { Embed } from '@constants/embed';
import { rollGiveaway } from '@functions/giveaway';
import Giveaway from '@schemas/Giveaway';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'giveaway',
  name: 'reroll',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.options.getNumber('giveaway-id');
    if (id === null || id === undefined)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid id to end.')],
      });

    const giveaway = await Giveaway.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!giveaway)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the giveaway!")],
      });

    const rerolledGiveaway = await rollGiveaway(client, giveaway);
    if (rerolledGiveaway === false)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('Giveaway has to be ended first! Use `/giveaway end` to end the giveaway.'),
        ],
      });

    if (!rerolledGiveaway)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'Something went wrong while rerolling the giveaway. Are you sure giveaways are enabled in this server?',
          ),
        ],
      });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Rerolled giveaway!')],
    });
  },
};
