import { Embed } from '@constants/embed';
import Giveaway from '@schemas/Giveaway';
import { rollGiveaway } from '@functions/giveaway';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'giveaway',
  name: 'end',

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

    const giveawayEnded = await rollGiveaway(client, giveaway, true, true);

    if (giveawayEnded === false)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Giveaway has already been ended!')],
      });

    if (!giveawayEnded)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'Something went wrong while ending the giveaway. Are you sure giveaways are enabled in this server?',
          ),
        ],
      });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Ended the giveaway!')],
    });
  },
};
