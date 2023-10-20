import { Embed } from '@constants/embed';
import { getLevelConfig } from '@configs/levelConfig';
import { getUserGame } from '@configs/userGame';
import type { CommandArgs } from '@typings/functionArgs';
import { getLevel } from '@configs/level';

export default {
  parent: 'profile',
  name: 'view',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const member = interaction.options.getMember('user') ?? interaction.member;
    if (!member || !('id' in member)) return await interaction.editReply("Couldn't find the member.");

    const levelConfig = await getLevelConfig(interaction.guildId!, client);
    const levelUser = await getLevel(interaction.guildId!, member.id);
    const userSchema = await getUserGame(member.id);

    if (!levelConfig || !levelUser || !userSchema)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const embed = new Embed(color)
      .setTitle(`${member.user.username}'s profile`)
      .setDescription(userSchema.bio)
      .setThumbnail(member.displayAvatarURL({ forceStatic: false }))
      .addFields({
        name: 'Birthday',
        value: `${
          userSchema.birthday.configured
            ? `${userSchema.birthday.day}/${userSchema.birthday.month}/${userSchema.birthday.year}`
            : 'Unset'
        }`,
        inline: true,
      });

    if (levelConfig.enabled)
      embed.addFields(
        { name: 'Level', value: `${levelUser.level ?? 0}`, inline: true },
        { name: 'Level XP', value: `${levelUser.xp ?? 0}`, inline: true },
      );

    embed.addFields(
      { name: 'Username', value: `${member.user.username}`, inline: true },
      {
        name: 'Displayname',
        value: `${member.displayName ?? 'None'}`,
        inline: true,
      },
      // { name: 'Discriminator', value: `${user.user.discriminator ?? 'None'}`, inline: true },
      {
        name: 'Joined server on',
        value: `<t:${Math.floor(member.joinedTimestamp ?? 0 / 1000)}:R>`,
        inline: true,
      },
      {
        name: 'Account created on',
        value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
    );

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
