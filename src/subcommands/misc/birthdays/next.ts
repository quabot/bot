import { Embed } from '@constants/embed';
import UserGame from '@schemas/UserGame';
import type { CommandArgs } from '@typings/functionArgs';
import moment from 'moment';

export default {
  parent: 'birthdays',
  name: 'next',
  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    if (!interaction.guild) return await interaction.editReply({ embeds: [new Embed(color).setDescription('This command can only be used in a server.')] });
    const arrayMemberIds = interaction.guild.members.cache.map((m) => m.id);

    const nextBirthdays = await UserGame.find({ birthday_set: true, userId: { $in: arrayMemberIds } }).sort({ birthday: 1 }).limit(10);
    if (!nextBirthdays.length)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('No birthdays have been set.')],
      });

    const description = nextBirthdays.map((u) => {
      return `**<@${u.userId}>** - ${moment(u.birthday).format('MMMM Do, YYYY')} (${moment().diff(u.birthday, 'years')})`;
    });

    await interaction.editReply({
      embeds: [new Embed(color).setTitle('Next 10 Birthdays').setDescription(description.join('\n'))],
    });
  },
};
