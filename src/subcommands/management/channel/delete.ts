import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import { ThreadChannel } from 'discord.js';
import type { GuildChannel } from '@typings/discord';

export default {
  parent: 'channel',
  name: 'delete',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const rawChannel = interaction.options.getChannel('channel', true);

    if ('guild_id' in rawChannel)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            `Sorry, Discord didn't give the channel to us in the right way. Please try again.`,
          ),
        ],
      });

    const channel = rawChannel as GuildChannel | ThreadChannel;

    await interaction.guild?.channels
      //? dc.js is dumb
      //@ts-ignore
      .delete(channel)
      .then(async () => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Deleted the channel #${channel?.name}.`)],
        });
      })
      .catch(async e => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Failed to delete the channel. Error message: ${e.message}.`)],
        });
      });
  },
};
