import { SlashCommandBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Get the URL to our dashboard.'),
  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setThumbnail(`${client.user!.avatarURL()}`)
          .setTitle('QuaBot Dashboard')
          .setDescription('You can find our dashboard [here](https://quabot.net)!'),
      ],
    });
  },
};
