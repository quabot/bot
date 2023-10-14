import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ChannelType } from 'discord.js';
import { CustomEmbed } from '@constants/customEmbed';
import { Embed } from '@constants/embed';
import Suggest from '@schemas/Suggestion';
import { getSuggestConfig } from '@configs/suggestConfig';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'suggestion-approve',

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

    if (suggestion.status === 'approved')
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The suggestion has already been approved.')],
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
      return await interaction.editReply({ content: "Channel isn't the correct type." });

    await channel.messages.fetch(suggestion.msgId).then(async message => {
      if (!message)
        return interaction.editReply({
          embeds: [new Embed(color).setDescription("Couldn't find the suggestion! Are you sure it wasn't deleted?")],
        });

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Suggestion approved.')],
      });

      suggestion.status = 'approved';
      await suggestion.save();

      message.edit({
        embeds: [
          EmbedBuilder.from(message.embeds[0])
            .setColor(Colors.Green)
            .addFields({
              name: 'Approved By',
              value: `${interaction.user}`,
              inline: true,
            })
            .setFooter({ text: 'This suggestion was approved!' }),
        ],
      });

      await interaction.message.edit({
        embeds: [
          new Embed(Colors.Green).setTitle('New Suggestion').addFields(
            {
              name: 'User',
              value: `${interaction.message.embeds[0].fields[0].value}`,
              inline: true,
            },
            { name: 'State', value: 'Approved', inline: true },
            {
              name: 'Approved By',
              value: `${interaction.user}`,
              inline: true,
            },
            { name: 'ID', value: `${suggestion.id}`, inline: true },
            {
              name: 'Message',
              value: `${interaction.message.embeds[0].fields[3].value}`,
              inline: true,
            },
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

      const parseString = (text: string) =>
        text
          .replaceAll('{suggestion}', suggestion.suggestion)
          .replaceAll('{user}', `${user}`)
          .replaceAll('{avatar}', user?.displayAvatarURL() ?? '')
          .replaceAll('{server}', interaction.guild?.name ?? '')
          .replaceAll('{staff}', `${interaction.user ?? ''}`)
          .replaceAll('{state}', 'approved')
          .replaceAll('{color}', color.toString())
          .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

      user?.send({
        embeds: [new CustomEmbed(config.dmMessage, parseString)],
        content: parseString(config.dmMessage.content),
      });
    });
  },
};
