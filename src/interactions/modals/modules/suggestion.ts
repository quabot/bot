import { ActionRowBuilder, ButtonStyle, ButtonBuilder, ChannelType } from 'discord.js';
import Suggestion from '@schemas/Suggestion';
import { getIdConfig } from '@configs/idConfig';
import { getSuggestConfig } from '@configs/suggestConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { Embed } from '@constants/embed';
import type { ModalArgs } from '@typings/functionArgs';
import { IIds } from '@typings/schemas';
import { NonNullMongooseReturn } from '@typings/mongoose';

export default {
  name: 'suggest',

  async execute({ client, interaction, color }: ModalArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getSuggestConfig(client, interaction.guildId ?? '');
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Suggestions are disabled in this server.')],
      });

    const channel = interaction.guild?.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'The suggestions channel has not been configured. This can be done our [dashboard](https://quabot.net).',
          ),
        ],
      });
    if (channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The suggestions channel isn't the right type.")],
      });

    const suggestion = interaction.fields.getTextInputValue('suggestion');
    if (!suggestion)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("You didn't give a suggestion.")],
      });

    const rawIds = await getIdConfig(interaction.guildId!, client);
    if (!rawIds)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!rawIds.suggestId && rawIds.suggestId !== 0) rawIds.suggestId = -1;

    const ids = rawIds as Omit<NonNullMongooseReturn<IIds>, 'suggestId'> & { suggestId: number };

    const getParsedString = (text: string) =>
      text
        .replaceAll('{suggestion}', suggestion)
        .replaceAll('{user}', `${interaction.user}`)
        .replaceAll('{avatar}', interaction.user.displayAvatarURL() ?? '')
        .replaceAll('{username}', `${interaction.user.username}`)
        .replaceAll('{tag}', `${interaction.user.tag}`)
        .replaceAll('{discriminator}', `${interaction.user.discriminator}`)
        .replaceAll('{servername}', `${interaction.guild?.name}`)
        .replaceAll('{id}', (++ids.suggestId).toString())
        .replaceAll('{server}', interaction.guild?.name ?? '')
        .replaceAll('{guild}', interaction.guild?.name ?? '')
        .replaceAll('{servername}', interaction.guild?.name ?? '')
        .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

    const suggestEmbed = new CustomEmbed(config.message, getParsedString);

    const msg = await channel.send({
      embeds: [suggestEmbed],
      content: getParsedString(config.message.content),
    });
    await msg.react(config.emojiGreen);
    await msg.react(config.emojiRed);

    ids.suggestId++;
    await ids.save();

    const newSuggestion = new Suggestion({
      guildId: interaction.guildId,
      id: ids.suggestId ?? 0,
      msgId: msg.id,
      suggestion: suggestion,
      status: 'pending',
      userId: interaction.user.id,
    });
    await newSuggestion.save();

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setDescription(
            `Successfully created your suggestion! You can check it out [here](${msg.url}). ${
              config.dm && 'You will receive a DM when staff has approved/denied your suggestion.'
            }`,
          )
          .setFooter({ text: `ID: ${ids.suggestId}` }),
      ],
    });

    if (!config.logEnabled) return;
    const logChannel = interaction.guild?.channels.cache.get(config.logChannelId);
    if (!logChannel || logChannel.type === ChannelType.GuildCategory || logChannel.type === ChannelType.GuildForum)
      return;

    await logChannel.send({
      embeds: [
        new Embed(config.colors.pending).setTitle('New Suggestion').addFields(
          { name: 'User', value: `${interaction.user}`, inline: true },
          { name: 'State', value: 'Pending', inline: true },
          { name: 'ID', value: `${ids.suggestId}`, inline: true },
          {
            name: 'Message',
            value: `[Click to jump](${msg.url})`,
            inline: true,
          },
          { name: 'Suggestion', value: `${suggestion}` },
        ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setCustomId('suggestion-approve').setLabel('Approve').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('suggestion-deny').setLabel('Deny').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('suggestion-delete').setLabel('Delete').setStyle(ButtonStyle.Secondary),
        ),
      ],
    });
  },
};
