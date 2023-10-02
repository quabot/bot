import { SlashCommandBuilder} from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs'

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('members')
    .setDescription('Get the amount of members in the server.')
    .setDMPermission(false),
  
  async execute({ interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setThumbnail(`${interaction.guild!.iconURL()}`)
          .setTitle(`${interaction.guild!.name}`)
          .setDescription(`${interaction.guild!.memberCount.toLocaleString()} members.`),
      ],
    });
  },
};
