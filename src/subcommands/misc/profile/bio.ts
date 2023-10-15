const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { getUserGame } = require('@configs/userGame');
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'profile',
  name: 'bio',

  async execute({ client, interaction, color }: CommandArgs) {
    const userSchema = await getUserGame(interaction.user.id);
    if (!userSchema)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
      });

    const modal = new ModalBuilder()
      .setTitle('Set your profile bio')
      .setCustomId('profile-bio')
      .addComponents(
        new ActionRowBuilder().setComponents(
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
