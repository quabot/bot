import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import { getLevelConfig } from '@configs/levelConfig';
import { getUserGame } from '@configs/userGame';
import Level from '@schemas/Level';
import type { ContextArgs } from '@typings/functionArgs';

export default {
  data: new ContextMenuCommandBuilder().setName('Profile').setType(ApplicationCommandType.User).setDMPermission(false),

  async execute({ client, interaction, color }: ContextArgs) {
    await interaction.deferReply();

    const user = interaction.targetMember;
    if (!user) return await interaction.editReply("Couldn't find a user.");

    const levelConfig = await getLevelConfig(interaction.guildId!, client);
    if (!levelConfig)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const levelUser = await Level.findOne({
      guildId: interaction.guildId,
      userId: user.user.id,
    });

    const userSchema = await getUserGame(user.user.id);
    if (!userSchema)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const embed = new Embed(color)
      .setTitle(`${user.user.username}'s profile`)
      .setDescription(userSchema.bio)
      .addFields({
        name: 'Birthday',
        value: `${
          userSchema.birthday.configured
            ? `${userSchema.birthday.day}/${userSchema.birthday.month}/${userSchema.birthday.year}`
            : 'Unset'
        }`,
        inline: true,
      });

    if ('displayAvatarURL' in user.user) embed.setThumbnail(user.user.displayAvatarURL({ forceStatic: false }));

    if (levelConfig.enabled)
      embed.addFields(
        { name: 'Level', value: `${levelUser?.level ?? 0}`, inline: true },
        { name: 'Level XP', value: `${levelUser?.xp ?? 0}`, inline: true },
      );

    const fields = [
      { name: 'Username', value: `${user.user.username}`, inline: true },
      {
        name: 'Displayname',
        value: `${'displayName' in user ? user.displayName : 'None'}`,
        inline: true,
      },
      // { name: 'Discriminator', value: `${user.user.discriminator ?? 'None'}`, inline: true },
    ];

    if ('joinedTimestamp' in user) {
      if (user.joinedTimestamp)
        fields.push({
          name: 'Joined server on',
          value: `<t:${Math.floor(user.joinedTimestamp / 1000)}:R>`,
          inline: true,
        });

      fields.push({
        name: 'Account created on',
        value: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:R>`,
        inline: true,
      });
    }

    embed.addFields(fields);

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
