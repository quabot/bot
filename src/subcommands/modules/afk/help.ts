import { getAfkConfig } from '@configs/afkConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'afk',
  name: 'help',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getAfkConfig(interaction.guildId!, client);
    const user = await getUser(interaction.guildId!, interaction.user.id);
    if (!config || !user)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The afk module is disabled in this server.')],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle('What is the AFK module and how do i use it?')
          .setDescription(`The AFK module is a way for you to set your 'status' to AFK. If you're AFK and you get mentioned by a user, they will be notified that you're AFK. You can set a custom message as to why you're AFK that users will see when they ping you. A full list of commands:
					\`/afk toggle\` - Enable/Disable your AFK status.
					\`/afk status\` - Set your AFK message.
					\`/afk list\` - See a list of AFK users in the server.
					\`/afk help\` - See help and commands about the AFK module.`),
      ],
    });
  },
};
