import { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';
import { getIdConfig } from '@configs/idConfig';
const { getReactionConfig } = require('@configs/reactionConfig');
import { Embed } from '@constants/embed';
const Reaction = require('@schemas/ReactionRole');
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'reactionroles',
  name: 'delete',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getReactionConfig(client, interaction.guildId);
    const ids = await getIdConfig(interaction.guildId);
    if (!config || !ids)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Reaction roles are not enabled in this server.')],
      });

    const channel = interaction.options.getChannel('channel');
    const messageId = interaction.options.getString('message-id');
    const emoji = interaction.options.getString('emoji');

    if (!channel || !messageId || !emoji)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
      });

    if (
      !(await Reaction.findOne({
        guildId: interaction.guildId,
        messageId,
        emoji: emoji,
        channelId: channel.id,
      }))
    )
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("That reaction role doesn't exist yet.")],
      });

    await Reaction.findOneAndDelete({
      guildId: interaction.guild.id,
      messageId,
      emoji: emoji,
      channelId: channel.id,
    });

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('Deleted the reaction role. I will attempt to remove my reaction now...'),
      ],
    });

    const message = await channel.messages.fetch({ message: messageId }).catch(async e => {
      return;
    });

    if (!message) return;

    const m = await message.reactions.resolve(emoji);
    if (m) m.users.remove(client.user.id);

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Successfully deleted the reaction role.')],
    });
  },
};
