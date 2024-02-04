import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import { ThreadChannel } from 'discord.js';
import type { GuildChannel } from '@typings/discord';
import { ChannelType } from 'discord.js';

export default {
  parent: 'channel',
  name: 'edit',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const rawChannel = interaction.options.getChannel('channel', true);
    const name = interaction.options.getString('name', true);

    if ('guild_id' in rawChannel)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            `Sorry, Discord didn't give the channel to us in the right way. Please try again..`,
          ),
        ],
      });

    const channel = rawChannel as GuildChannel | ThreadChannel;
    const editOptions = channel.type === ChannelType.GuildForum ? { topic: name } : { name };

    await channel
      .edit(editOptions)
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
