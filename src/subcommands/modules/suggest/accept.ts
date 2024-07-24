import { ActionRowBuilder, Colors, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getSuggestConfig } from '@configs/suggestConfig';
import { Embed } from '@constants/embed';
import Suggest from '@schemas/Suggestion';
import { CustomEmbed } from '@constants/customEmbed';
import type { CommandArgs } from '@typings/functionArgs';
import { ChannelType } from 'discord.js';
import { SuggestionParser } from '@classes/parsers';

export default {
  parent: 'suggestion',
  name: 'approve',

  async execute({ client, interaction, color }: CommandArgs) {

    const config = await getSuggestConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
        ephemeral: true,
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Suggestions are disabled in this server!')],
        ephemeral: true,
      });

    const id = interaction.options.getNumber('suggestion-id');
    const suggestion = await Suggest.findOne({
      guildId: interaction.guildId,
      id,
    });

    if (!suggestion)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestion.")],
        ephemeral: true,
      });

    if (suggestion.status === 'approved')
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('The suggestion has already been approved.')],
        ephemeral: true,
      });

    const channel = interaction.guild?.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestions channel.")],
        ephemeral: true,
      });
    if (channel.type === ChannelType.GuildCategory)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("Suggestions channel can't be a category.")],
        ephemeral: true,
      });

    await channel.messages.fetch(suggestion.msgId).then(async message => {
      if (!message)
        return interaction.reply({
          embeds: [new Embed(color).setDescription("Couldn't find the suggestion! Are you sure it wasn't deleted?")],
          ephemeral: true,
        });

      let approvalReason = 'No reason specified.';
      if (config.reasonRequired) {
        const modal = new ModalBuilder()
          .setTitle('Reason for approving')
          .setCustomId('approve-suggest')
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Approval Reason')
                .setMaxLength(500)
                .setMinLength(2)
                .setPlaceholder('Leave an approval reason...')
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph),
            ),
          );

        await interaction.showModal(modal);

        const modalResponse = await interaction
          .awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
          })
          .catch(() => { });

        if (modalResponse && modalResponse.customId === 'approve-suggest')
          approvalReason = modalResponse.fields.getTextInputValue('reason');

        if (!modalResponse) return;

        await modalResponse.reply({
          embeds: [new Embed(color).setDescription('Suggestion approved.')],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [new Embed(color).setDescription('Suggestion approved.')],
        });
      }

      suggestion.status = 'approved';
      await suggestion.save();

      await message.edit({
        embeds: [
          EmbedBuilder.from(message.embeds[0])
            .setColor(Colors.Green)
            .addFields({
              name: 'Approved By',
              value: `${interaction.user}`,
              inline: true,
            },
              { name: 'Reason', value: `${approvalReason}`, inline: true })
            .setFooter({ text: 'This suggestion was approved!' }),
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
    }).
      catch(async (e) => {
        console.log(e)
        await interaction.reply({
          embeds: [new Embed(color).setDescription("Couldn't find the suggestion! Are you sure it wasn't deleted?")],
          ephemeral: true,
        });
      });
  },
};
