import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import Punishment from '@schemas/Punishment';
import User from '@schemas/User';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  name: 'revoke',
  async execute({ interaction, color }: ButtonArgs) {
    const id = interaction.message.embeds[0].footer?.text;
    if (!id)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription('An internal error occurred: no punishment ID in embed footer found.'),
        ],
        ephemeral: true,
      });

    const punishment = await Punishment.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!punishment)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('An internal error occurred: no punishment found for the ID.')],
        ephemeral: true,
      });

    const user = await User.findOne({
      guildId: interaction.guildId,
      userId: punishment.userId,
    });
    if (!user)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('An internal error occurred: no user found for the punishment.')],
        ephemeral: true,
      });

    const member = await interaction.guild?.members.fetch(punishment.userId).catch(() => null);
    if (punishment.type === 'timeout') {
      await member?.timeout(0, `Punishment deleted by ${interaction.user.tag}`);
      user.timeouts -= 1;
      await user.save();
    } else if (punishment.type === 'ban' || punishment.type === 'tempban') {
      await interaction
        .guild!.members.unban(punishment.userId, `Punishment deleted by ${interaction.user.tag}`)
        .catch(() => {});
      if (punishment.type === 'tempban') {
        user.tempbans -= 1;
      } else {
        user.bans -= 1;
      }
      await user.save();
    } else if (punishment.type === 'kick') {
      user.kicks -= 1;
      await user.save();
    } else if (punishment.type === 'warn') {
      user.warns -= 1;
      await user.save();
    }

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
      .setCustomId('revoke')
      .setLabel('Remove Punishment')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
      .setEmoji('🔓'),
    );

    await interaction.update({
      components: [row],
    });

    await interaction.followUp({
      embeds: [new Embed(color).setDescription('Punishment deleted.')],
      ephemeral: true,
    });

    await Punishment.deleteOne({ guildId: interaction.guildId, id });
  },
};
