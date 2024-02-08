import { Embed } from '@constants/embed';
import ms from 'ms';
import type { CommandArgs } from '@typings/functionArgs';
import { GuildChannel, GuildTextBasedChannel } from '@typings/discord';
import { CategoryChannel } from 'discord.js';
import { ChannelType } from 'discord.js';

export default {
  parent: 'channel',
  name: 'slowmode',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel('channel', true, [
      ...GuildTextBasedChannel,
      ChannelType.GuildForum,
    ]) as Exclude<GuildChannel, CategoryChannel>;
    let slowmode = Math.round(ms(interaction.options.getString('slowmode', true)) / 1000);

    if (!slowmode)
      return interaction
        .editReply({
          embeds: [new Embed(color).setDescription('Please give a valid slowmode amount.')],
        })
        .catch(() => {});

    if (slowmode > 21600) slowmode = 21600;
    if (slowmode < 0) slowmode = 0;

    await channel
      .setRateLimitPerUser(slowmode)
      .then(async () => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription('Updated the channel slowmode.')],
        });
      })
      .catch(async e => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Failed to set the slowmode. Error message: ${e.message}.`)],
        });
      });
  },
};
