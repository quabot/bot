import { getUserGame } from '@configs/userGame';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'birthdays',
  name: 'remove',
  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();
    
    const user = interaction.user;
    const userConfig = await getUserGame(user.id);
    if (!userConfig)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('An error occurred while removing your birthday.')],
      });

    userConfig.birthday = new Date();
    userConfig.birthday_set = false;

    await userConfig.save();
    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Your birthday has been removed.')],
    });
  },
};
