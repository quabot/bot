import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'star-messages',
  name: 'help',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle('What is the star messages module and how do i use it?')
          .setDescription(`Using the star messages module you can have users in the server vote on a message, simply by leaving a star (or another emoji) as a reaction on the message. Once the message reaches a certain (admin defined) amount of reactions on the message, it will be sent into the Star Channel, where it is forever immortalized. View the commands here:
					\`/star-messages add\` - Force-add a message to the star channel.
					\`/star-messages help\` - Receive help about the star messages module.
					\`/star-messages remove\` - Remove a message from the star channel.
          \`/star-messages stats\` - View your own or someone else's stats about the starboard.\n\nIf you need any further help, feel free to join our [support server](https://discord.quabot.net)!`),
      ],
    });
  },
};
