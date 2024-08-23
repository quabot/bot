import { Client } from '@classes/discord';
import { getModerationConfig } from '@configs/moderationConfig';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export default {
  parent: 'report',
  name: 'message',

  async execute({ interaction, color }: CommandArgs, client: Client) {
    const url = interaction.options.getString('message-url');
    if (!url)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You need to provide a message URL!')],
      });

    if (!interaction.channel)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This command can only be used in a guild!')],
      });

    if (!interaction.channel.isTextBased())
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This command can only be used in text channels!')],
      });

    const ids = url.match(/\d+/g);
    if (!ids) return;

    const channel = interaction.guild?.channels.cache.get(ids[1]);
    if (!channel)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Could not find the channel!')],
      });
    if (!channel.isTextBased())
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The channel is not a text channel!')],
      });

    await channel.messages.fetch(ids[2]).then(async message => {
      const config = await getModerationConfig(client, interaction.guildId ?? '');
      if (!config)
        return await interaction.reply({
          embeds: [
            new Embed(color).setDescription('Failed to load the configuration for moderation, please try again.'),
          ],
          ephemeral: true,
        });

      if (!config.reportEnabled)
        return await interaction.reply({
          embeds: [new Embed(color).setDescription('Reporting to staff is disabled on this server.')],
          ephemeral: true,
        });

      const channel = interaction.guild?.channels.cache.get(config.reportChannelId);
      if (!channel)
        return await interaction.reply({
          embeds: [new Embed(color).setDescription('Failed to find the report channel, please try again.')],
          ephemeral: true,
        });
      if (!channel.isTextBased())
        return await interaction.reply({
          ephemeral: true,
          embeds: [new Embed(color).setDescription('The report channel must be a text channel.')],
        });

      const modalBuilder = new ModalBuilder()
        .setTitle(`Reporting a message`)
        .setCustomId('report-message')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('Reason')
              .setPlaceholder('Reason')
              .setRequired(true)
              .setMaxLength(1000)
              .setStyle(TextInputStyle.Paragraph),
          ),
        );

      await interaction.showModal(modalBuilder);

      const modal = await interaction
        .awaitModalSubmit({
          time: 180000,
          filter: i => i.user.id === interaction.user.id,
        })
        .catch(() => null);
      if (!modal) return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});

      const reason = modal.fields.getTextInputValue('reason');
      if (!reason)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('Please provide a reason for the report.')],
        });

      await channel.send({
        embeds: [
          new Embed(color)
            .setTitle('Message Reported')
            .setDescription(
              `**Author:** ${message.author} ([Click to jump](${message.url}))\n\n**Reported by:** ${interaction.user}\n**Reason:** ${reason}`,
            )
            .setTimestamp(),
        ],
      });

      await modal.editReply({
        embeds: [
          new Embed(color).setDescription(
            'The report has been sent to the staff, thank you for your report.\n\nPlease note that if this user has done something that violates the Discord Terms of Service, you should report them, as well as the message, to Discord Trust & Safety.',
          ),
        ],
      });
    });
  },
};
