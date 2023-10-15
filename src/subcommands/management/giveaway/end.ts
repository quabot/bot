import { getGiveawayConfig } from '@configs/giveawayConfig';
import { Embed } from '@constants/embed';
import Giveaway from '@schemas/Giveaway';
import { endGiveaway } from '@functions/giveaway';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'giveaway',
  name: 'end',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getGiveawayConfig(interaction.guildId, client);

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
        embeds: [new Embed(color).setDescription('Giveaways are disabled in this server.')],
      });

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

    await endGiveaway(client, giveaway, true);

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Ended the giveaway!')],
    });
  },
};
