import { getUserGame } from '@configs/userGame';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import moment from 'moment';

export default {
  parent: 'birthdays',
  name: 'set',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const date = interaction.options.getString('date', true);
    const user = interaction.user;
    if (!date)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('Please provide a valid date in the format DD/MM/YYYY.')],
      });

    const dateArr = date.split('/');
    if (dateArr.length !== 3)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('Please provide a valid date in the format DD/MM/YYYY.')],
      });

      const day = parseInt(dateArr[0]);
    const month = parseInt(dateArr[1]);
    const year = parseInt(dateArr[2]);
    if (isNaN(month) || isNaN(day) || isNaN(year))
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('Please provide a valid date in the format DD/MM/YYYY.')],
      });

    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear())
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('Please provide a valid date in the format DD/MM/YYYY.')],
      });

    const parsedDate = new Date(year, month - 1, day);

    const userConfig = await getUserGame(user.id);
    if (!userConfig)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('An error occurred while setting your birthday.')],
      });

    userConfig.birthday = parsedDate;
    userConfig.birthday_set = true;
    await userConfig.save();

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Your birthday has been set to **${moment(parsedDate).format('MMMM Do, YYYY')}**.`,
        ),
      ],
    });
  },
};
