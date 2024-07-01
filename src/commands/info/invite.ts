import { SlashCommandBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get an invite to add QuaBot to your own server.')
    .setDMPermission(false),

  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setThumbnail(`${client.user!.avatarURL()}`)
          .setTitle('Add QuaBot')
          .setURL('https://discord.com/oauth2/authorize?client_id=995243562134409296&permissions=274878426206&redirect_uri=https%3A%2F%2Fquabot.net%2Fauth&response_type=code&scope=bot%20applications.commands%20guilds%20identify')
          .setDescription(
            'Do you like QuaBot and do you want to try it out for yourself? Invite it [here](https://discord.com/oauth2/authorize?client_id=995243562134409296&permissions=274878426206&redirect_uri=https%3A%2F%2Fquabot.net%2Fauth&response_type=code&scope=bot%20applications.commands%20guilds%20identify)! This link will also redirect your to our [dashboard](https://quabot.net/dashboard).',
          ),
      ],
    });
  },
};
