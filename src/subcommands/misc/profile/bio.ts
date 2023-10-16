import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getUserGame } from '@configs/userGame';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'profile',
  name: 'bio',

  async execute({ client, interaction, color }: CommandArgs) {
    const userSchema = await getUserGame(interaction.user.id, client);
    if (!userSchema)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const modal = new ModalBuilder()
      .setTitle('Set your profile bio')
      .setCustomId('profile-bio')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('bio')
            .setMaxLength(350)
            .setMinLength(1)
            .setLabel('Bio')
            .setValue(userSchema.bio)
            .setPlaceholder('I am...')
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph),
        ),
      );

    interaction.showModal(modal);
  },
};
