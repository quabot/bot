import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'channel',
  name: 'delete',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel('channel');

    await interaction.guild?.channels
      .delete(channel)
      .then(async () => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Deleted the channel #${channel.name}.`)],
        });
      })
      .catch(async e => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Failed to delete the channel. Error message: ${e.message}.`)],
        });
      });
  },
};
