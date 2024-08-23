import { Embed } from '@constants/embed';
import PunishmentAppeal from '@schemas/PunishmentAppeal';
import { getModerationConfig } from '@configs/moderationConfig';
import { ButtonArgs } from '@typings/functionArgs';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';

export default {
  name: 'appeal-deny',
  async execute({ interaction, color, client }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.message.embeds[0].footer?.text;
    if (!id)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription('An internal error occurred: no punishment ID in embed footer found.'),
        ],
        ephemeral: true,
      });

    const config = await getModerationConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('An internal error occurred: no moderation config found.')],
      });

    const appeal = await PunishmentAppeal.findOne({
      punishmentId: id,
      guildId: interaction.guildId,
    });
    if (!appeal)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('An internal error occurred: no appeal found for the ID.')],
      });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Denied appeal. User will be notified, punishment will not be revoked. User cannot apply again.')],
    });

    appeal.state = 'denied';
    await appeal.save();

    //* Disable all the buttons on the message.
    await interaction.message.edit({
      embeds: [EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Red)],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setCustomId('appeal-view').setLabel('View answers').setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('appeal-accept')
            .setLabel('Accept and revoke punishment')
            .setDisabled(true)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('appeal-deny')
            .setDisabled(true)
            .setLabel('Deny and keep punishment')
            .setStyle(ButtonStyle.Danger),
        ),
      ],
    });

    const member = await interaction.guild?.members.fetch(appeal.userId);
    if (!member) return;

    await member
      .send({
        embeds: [
          new Embed(color)
            .setTitle('Appeal Denied')
            .setDescription('Your appeal has been denied. You cannot apply again.'),
        ],
      })
      .catch(() => {});
  },
};
