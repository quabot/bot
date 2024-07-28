import { SlashCommandBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('reactionroles')
    .setDescription('Manage reaction roles.')
    .setDMPermission(false),

  async execute({ interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `The reaction roles module can only be configured on our dashboard. It features a full guide to explain how it works and how to set it up. Go to [quabot.net/dashboard](https://quabot.net/dashboard/${interaction.guildId}/reaction-roles) to configure the module.`,
        ),
      ],
    });
  },
};
