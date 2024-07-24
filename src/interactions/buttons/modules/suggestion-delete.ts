import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } from 'discord.js';
import Suggest from '@schemas/Suggestion';
import { getSuggestConfig } from '@configs/suggestConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import { ChannelType } from 'discord.js';
import { SuggestionParser } from '@classes/parsers';

export default {
  name: 'suggestion-delete',

  async execute({ client, interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: true });

    const id = parseInt(interaction.message.embeds[0].fields[2].value);
    const suggestion = await Suggest.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!suggestion)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestion.")],
      });

    const config = await getSuggestConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Suggestions are disabled in this server!')],
      });

    const channel = interaction.guild?.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestions channel.")],
      });
    if (channel.type === ChannelType.GuildCategory)
      return await interaction.editReply({ content: "Suggestions channel isn't the correct type." });

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

      await interaction.message.edit({
        embeds: [
          new Embed(Colors.DarkRed).setTitle('New Suggestion').addFields(
            {
              name: 'User',
              value: `${interaction.message.embeds[0].fields[0].value}`,
              inline: true,
            },
            { name: 'State', value: 'Deleted', inline: true },
            { name: 'ID', value: `${suggestion.id}`, inline: true },
            {
              name: 'Suggestion',
              value: `${suggestion.suggestion}`,
            },
          ),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId('suggestion-approve')
              .setLabel('Approve')
              .setDisabled(true)
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setDisabled(true)
              .setCustomId('suggestion-deny')
              .setLabel('Deny')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setDisabled(true)
              .setCustomId('suggestion-delete')
              .setLabel('Delete')
              .setStyle(ButtonStyle.Secondary),
          ),
        ],
      });

      if (!config.dm) return;

      const user = interaction.guild?.members.cache.get(`${suggestion.userId}`);

      if (!user) return;

      const parser = new SuggestionParser({ member: user, interaction, color, suggestion });

      const embed = new CustomEmbed(config.dmMessage, parser);
      user?.send({
        embeds: [embed],
        content: parser.parse(config.dmMessage.content),
      });
    }).catch(() => {
      return interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestion! Are you sure it wasn't deleted?")],
      });
    });
  },
};
