import { Embed } from '@constants/embed';
import { getUserGame } from '@configs/userGame';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'profile',
  name: 'birthday',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const userSchema = await getUserGame(interaction.user.id);
    if (!userSchema)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const day = interaction.options.getNumber('day', true);
    const month = interaction.options.getNumber('month', true);
    const year = interaction.options.getNumber('year', true);

    if (year > new Date().getFullYear())
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid birthday.')],
      });

    userSchema.birthday = {
      configured: true,
      day,
      month,
      year,
    };
    await userSchema.save();

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Updated your birthday!')],
    });
  },
};
