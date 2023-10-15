import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'channel',
  name: 'create',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const channel_name = interaction.options.getString('name');
    const channel_topic = interaction.options.getString('topic');
    const channel_nsfw = interaction.options.getBoolean('nsfw') ?? false;

    await interaction.guild?.channels
      .create({
        name: channel_name,
        topic: channel_topic,
        nsfw: channel_nsfw,
        reason: `Channel created by ${interaction.user.username}`,
      })
      .then(async d => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Created the channel ${d}.`)],
        });
      })
      .catch(async e => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Failed to create the channel. Error message: ${e.message}.`)],
        });
      });
  },
};
