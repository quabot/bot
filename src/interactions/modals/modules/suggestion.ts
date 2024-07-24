import { ActionRowBuilder, ButtonStyle, ButtonBuilder, type GuildMember } from 'discord.js';
import Suggestion from '@schemas/Suggestion';
import { getIdConfig } from '@configs/idConfig';
import { getSuggestConfig } from '@configs/suggestConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { Embed } from '@constants/embed';
import type { ModalArgs } from '@typings/functionArgs';
import { IIds } from '@typings/schemas';
import { NonNullMongooseReturn } from '@typings/mongoose';
import { hasSendPerms } from '@functions/discord';
import { MemberParser } from '@classes/parsers';

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
    if (!channel.isTextBased())
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The suggestions channel isn't the right type.")],
      });
    if (!hasSendPerms(channel))
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription("Can't send the suggestion. I don't have the `SendMessages` permission."),
        ],
      });

    const suggestion = interaction.fields.getTextInputValue('suggestion');
    if (!suggestion)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("You didn't give a suggestion.")],
      });

    const rawIds = await getIdConfig(interaction.guildId!);
    if (!rawIds)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!rawIds.suggestId && rawIds.suggestId !== 0) rawIds.suggestId = -1;

    const ids = rawIds as Omit<NonNullMongooseReturn<IIds>, 'suggestId'> & { suggestId: number };

    const parser = new MemberParser({ member: interaction.member as GuildMember, color }).addVariables({
      name: 'id',
      value: `${ids.suggestId}`,
    }).addVariables({
      name: 'suggestion',
      value: suggestion,
    });

    const suggestEmbed = new CustomEmbed(config.message, parser);

    const msg = await channel.send({
      embeds: [suggestEmbed],
      content: parser.parse(config.message.content),
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
              config.dm ? 'You will receive a DM when staff has approved/denied your suggestion.' : ''
            }`,
          )
          .setFooter({ text: `ID: ${ids.suggestId}` }),
      ],
    });

    if (!config.logEnabled) return;
    const logChannel = interaction.guild?.channels.cache.get(config.logChannelId);
    if (!logChannel?.isTextBased()) return;
    if (!hasSendPerms(logChannel))
      return await interaction.followUp({
        embeds: [new Embed(color).setDescription("Didn't send the log. I don't have the `Send Messages` permission.")],
        ephemeral: true,
      });

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
