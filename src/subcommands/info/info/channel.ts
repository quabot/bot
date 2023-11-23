import { CHANNEL_TYPES } from '@constants/discord';
import { Embed } from '@constants/embed';
import { GuildChannel } from '@typings/discord';
import type { CommandArgs } from '@typings/functionArgs';
import { ThreadChannel } from 'discord.js';

export default {
  parent: 'info',
  name: 'channel',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const rawChannel = interaction.options.getChannel('channel') ?? interaction.channel!;

    if ('guild_id' in rawChannel)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            `Sorry, Discord didn't give the channel to us in the right way. Please try again.`,
          ),
        ],
      });

    const channel = rawChannel as GuildChannel | ThreadChannel;

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle('Channel Info').setDescription(`
                    - **Name:** ${channel.name}\n- **Channel:** ${channel}\n- **ID:** ${channel.id}\n- **Type:** ${
                      CHANNEL_TYPES[channel.type]
                    }\n- **NSFW:** ${
                      channel.isTextBased() && !channel.isThread()
                        ? channel.nsfw
                          ? 'Enabled'
                          : 'Disabled'
                        : 'Impossable'
                    }\n- **Cooldown:** ${
                      channel.isTextBased()
                        ? channel.rateLimitPerUser !== 0
                          ? `${channel.rateLimitPerUser}s`
                          : 'Disabled'
                        : 'Impossable'
                    }\n- **Parent:** ${channel.parentId ? '<#' + channel.parentId + '>' : 'None'}
                    `),
      ],
    });
  },
};
