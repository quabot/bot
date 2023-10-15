const { Client, ChatInputCommandInteraction } = require('discord.js');
const { getSuggestConfig } = require('@configs/suggestConfig');
import { Embed } from '@constants/embed';
const { CustomEmbed } = require('@constants/customEmbed');
const Suggest = require('@schemas/Suggestion');
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'suggestion',
  name: 'delete',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getSuggestConfig(client, interaction.guildId);
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

    const channel = interaction.guild.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestions channel.")],
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

      const user = interaction.guild.members.cache.get(`${suggestion.userId}`);
      const parseString = text =>
        text
          .replaceAll('{suggestion}', suggestion.suggestion)
          .replaceAll('{user}', `${user}`)
          .replaceAll('{avatar}', user.displayAvatarURL() ?? '')
          .replaceAll('{server}', interaction.guild?.name ?? '')
          .replaceAll('{staff}', `${interaction.user ?? ''}`)
          .replaceAll('{state}', 'deleted')
          .replaceAll('{color}', color)
          .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

      const embed = new CustomEmbed(config.dmMessage, parseString);
      user.send({
        embeds: [embed],
        content: parseString(config.dmMessage.content),
      });
    });
  },
};
