import { CHANNEL_TYPES } from '@constants/discord';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'info',
  name: 'channel',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const channel = interaction.options.getChannel('channel') ?? interaction.channel;

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle('Channel Info').setDescription(`
                    - **Name:** ${channel?.name}\n- **Channel:** ${channel}\n- **ID:** ${channel?.id}\n- **Type:** ${
                      CHANNEL_TYPES[channel?.type]
                    }\n- **NSFW:** ${channel?.nsfw ? 'Enabled' : 'Disabled'}\n- **Ratelimit:** ${
                      channel?.rateLimitPerUser !== 0 ? 'Enabled' : 'Disabled'
                    }\n- **Parent:** ${channel?.parentId ? '<#' + channel?.parentId + '>' : 'None'}
                    `),
      ],
    });
  },
};
