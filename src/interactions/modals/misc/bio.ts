import { Embed } from '@constants/embed';
import { getUserGame } from '@configs/userGame';
import type { ModalArgs } from '@typings/functionArgs';

export default {
  name: 'profile-bio',

  async execute({ interaction, color }: ModalArgs) {
    await interaction.deferReply({ ephemeral: true });

    const userSchema = await getUserGame(interaction.user.id);
    if (!userSchema)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const bio = interaction.fields.getTextInputValue('bio');

    userSchema.bio = bio ?? '-';
    await userSchema.save();

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Updated your bio!')],
    });
  },
};
