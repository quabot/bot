import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from 'discord.js';
import { embed } from '../../utils/constants/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("View a user's avatar.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription("The user you'd like to see the avatar from!")
    )
    .setDMPermission(false),
  async execute(
    client: Client,
    interaction: ChatInputCommandInteraction,
    color: any
  ) {
    await interaction.deferReply();

    const user =
      (await interaction.options.getUser('user')) ?? interaction.user;

    const avatar = user.avatarURL();

    await interaction.editReply({
      embeds: [
        (avatar
          ? embed(color).setImage(avatar)
          : embed(color).setDescription("This person doesn't have an avatar!")
        ).setTitle(`${user.tag}'s avatar`),
      ],
    });
  },
};
