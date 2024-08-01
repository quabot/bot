import { Embed } from '@constants/embed';
import PunishmentAppeal from '@schemas/PunishmentAppeal';
import { getModerationConfig } from '@configs/moderationConfig';
import { ButtonArgs } from '@typings/functionArgs';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';

export default {
  name: 'appeal-accept',
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
      embeds: [new Embed(color).setDescription('Accepted appeal. User will be notified and the punishment revoked.')],
    });

    appeal.state = 'approved';
    await appeal.save();

    //* Disable all the buttons on the message.
    await interaction.message.edit({
      embeds: [EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Green)],
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
            .setTitle('Appeal Accepted')
            .setDescription('Your appeal has been accepted. The punishment has been revoked.'),
        ],
      })
      .catch(() => {});

    switch (appeal.type) {
      case 'timeout':
        await member.timeout(100, `Punishment appeal accepted by @${interaction.user.username}.`);
        break;
      case 'ban':
        await interaction
          .guild!.members.unban(appeal.userId, `Punishment appeal accepted by @${interaction.user.username}.`)
          .catch(async () => {
            await interaction.editReply({
              embeds: [
                new Embed(color).setDescription(
                  'Accepted appeal. User will be notified and the punishment revoked.\n\n**⚠️ Failed to revoke the ban. Please unban this user manually.**',
                ),
              ],
            });
          });
        break;
      case 'tempban':
        await interaction
          .guild!.members.unban(appeal.userId, `Punishment appeal accepted by @${interaction.user.username}.`)
          .catch(async () => {
            await interaction.editReply({
              embeds: [
                new Embed(color).setDescription(
                  'Accepted appeal. User will be notified and the punishment revoked.\n\n**⚠️ Failed to revoke the ban. Please unban this user manually.**',
                ),
              ],
            });
          });
        break;
    }
  },
};
