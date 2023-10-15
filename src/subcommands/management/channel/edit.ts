import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'channel',
  name: 'edit',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel('channel');
    const name = interaction.options.getString('name') ?? channel.name;
    const topic = interaction.options.getString('topic') ?? channel.topic;

    await channel
      .edit({
        name,
        topic,
      })
      .then(async () => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Edit the channel ${channel}.`)],
        });
      })
      .catch(async e => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Failed to edit the channel. Error message: ${e.message}.`)],
        });
      });
  },
};
