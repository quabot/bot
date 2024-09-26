import { getUserGame } from '@configs/userGame';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import moment from 'moment';

export default {
  parent: 'birthdays',
  name: 'view',
  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user') || interaction.user;

    const userConfig = await getUserGame(user.id);
    if (!userConfig)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('An error occurred while viewing the birthday.')],
      });

    if (!userConfig.birthday_set)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription(`${user} has not set their birthday.`)],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `${user}'s birthday is on **${moment(userConfig.birthday).format('MMMM Do, YYYY')}**. They will turn ${
            moment().diff(userConfig.birthday, 'years') + 1
          } years old.`,
        ),
      ],
    });
  },
};
