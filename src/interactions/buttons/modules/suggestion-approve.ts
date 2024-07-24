import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { CustomEmbed } from '@constants/customEmbed';
import { Embed } from '@constants/embed';
import Suggest from '@schemas/Suggestion';
import { getSuggestConfig } from '@configs/suggestConfig';
import type { ButtonArgs } from '@typings/functionArgs';
import { SuggestionParser } from '@classes/parsers';

export default {
  name: 'suggestion-approve',

  async execute({ client, interaction, color }: ButtonArgs) {
    const id = parseInt(interaction.message.embeds[0].fields[2].value);
    const suggestion = await Suggest.findOne({
      guildId: interaction.guildId,
      id,
    });

    if (!suggestion)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestion.")],
        ephemeral: true
      });

    if (suggestion.status === 'approved')
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('The suggestion has already been approved.')],
        ephemeral: true
      });

    const config = await getSuggestConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
        ephemeral: true
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Suggestions are disabled in this server!')],
        ephemeral: true
      });

    const channel = interaction.guild?.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestions channel.")],
        ephemeral: true
      });
    if (channel.type === ChannelType.GuildCategory)
      return await interaction.reply({ content: "Channel isn't the correct type." });

    await channel.messages.fetch(suggestion.msgId).then(async message => {
      if (!message)
        return interaction.reply({
          embeds: [new Embed(color).setDescription("Couldn't find the suggestion! Are you sure it wasn't deleted?")],
          ephemeral: true
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

      message.edit({
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
            {
              name: 'Approval Reason',
              value: `${approvalReason}`,
              inline: true
            }
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

      user?.send({
        embeds: [new CustomEmbed(config.dmMessage, parser)],
        content: parser.parse(config.dmMessage.content),
      });
    });
  },
};
