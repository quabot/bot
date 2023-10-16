import { getSuggestConfig } from '@configs/suggestConfig';
import { Embed } from '@constants/embed';
import { CustomEmbed } from '@constants/customEmbed';
import Suggest from '@schemas/Suggestion';
import type { CommandArgs } from '@typings/functionArgs';
import { ChannelType } from 'discord.js';

export default {
  parent: 'suggestion',
  name: 'delete',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getSuggestConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Suggestions are disabled in this server!')],
      });

    const id = interaction.options.getNumber('suggestion-id');
    const suggestion = await Suggest.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!suggestion)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestion.")],
      });

    const channel = interaction.guild?.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestions channel.")],
      });
    if (channel.type === ChannelType.GuildCategory)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("Suggestions channel can't be a category.")],
        ephemeral: true,
      });

    await channel.messages.fetch(suggestion.msgId).then(async message => {
      if (!message)
        return interaction.editReply({
          embeds: [new Embed(color).setDescription("Couldn't find the suggestion! Are you sure it wasn't deleted?")],
        });

      await message.delete();
      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Suggestion deleted.')],
      });

      await Suggest.findOneAndDelete({ id, guildId: interaction.guildId });

      if (!config.dm) return;

      const user = interaction.guild?.members.cache.get(`${suggestion.userId}`);
      const parseString = (text: string) =>
        text
          .replaceAll('{suggestion}', suggestion.suggestion)
          .replaceAll('{user}', `${user}`)
          .replaceAll('{avatar}', user?.displayAvatarURL() ?? '')
          .replaceAll('{server}', interaction.guild?.name ?? '')
          .replaceAll('{staff}', `${interaction.user ?? ''}`)
          .replaceAll('{state}', 'deleted')
          .replaceAll('{color}', color.toString())
          .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

      const embed = new CustomEmbed(config.dmMessage, parseString);
      user?.send({
        embeds: [embed],
        content: parseString(config.dmMessage.content),
      });
    });
  },
};
