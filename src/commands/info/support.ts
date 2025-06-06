import { SlashCommandBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get the invite to the QuaBot support server.')
    .setDMPermission(false),
  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setThumbnail(`${client.user!.avatarURL()}`)
          .setTitle('QuaBot Support')
          .setDescription(
            'Join our support server [here](https://discord.gg/kxKHuy47Eq) for fun, events, questions and suggestions! You can also take a look at our [documentation](https://wiki.quabot.net) for more information.',
          ),
      ],
    });
  },
};
