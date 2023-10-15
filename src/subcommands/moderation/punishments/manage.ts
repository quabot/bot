const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
} = require('discord.js');
import { Embed }from '@constants/embed';
import ms from 'ms'
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'punishments',
  name: 'manage',
  
async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser('user');
    const type = interaction.options.getString('type');
    const id = interaction.options.getString('id');

    const Punishment = require('@schemas/Punishment');
    let punishment;
    if (user)
      punishment = await Punishment.findOne({
        guildId: interaction.guildId,
        id,
        userId: user.id,
        type,
      });
    if (!user)
      punishment = await Punishment.findOne({
        guildId: interaction.guildId,
        id,
        type,
      });

    if (!punishment)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('No punishment with those filters found.')],
      });

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Delete')
        .setEmoji('🗑️')
        .setCustomId('delete-punishment'),
    );

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('Manage Punishment')
          .setFooter({ text: `${punishment.id}` })
          .addFields(
            {
              name: 'Type',
              value: punishment.type,
              inline: true,
            },
            {
              name: 'User',
              value: `<@${punishment.userId}>`,
              inline: true,
            },
            {
              name: 'Moderator',
              value: `<@${punishment.moderatorId}>`,
              inline: true,
            },
            {
              name: 'Time',
              value: `<t:${Math.floor(punishment.time / 1000)}:R>`,
              inline: true,
            },
            {
              name: 'Duration',
              value: punishment.duration ? punishment.duration : 'Permanent',
              inline: true,
            },
            {
              name: 'Reason',
              value: punishment.reason,
              ,
            },
          ),
      ],
      components: [row],
    });
  },
};
