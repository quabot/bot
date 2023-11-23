import { getIdConfig } from '@configs/idConfig';
import { getTicketConfig } from '@configs/ticketConfig';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'ticket',
  name: 'help',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    await getTicketConfig(client, interaction.guildId!);
    await getIdConfig(interaction.guildId!);

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('What are tickets and how do i use them?')
          .setDescription(
            `Tickets are a way to get help or ask something from staff members directly. When you run the command to create a ticket (/ticket create) you can choose to specify a topic. A channel will be created and you can ask the staff team about whatever it is you have a question about. When you're done, run /ticket close to close the ticket. All the ticket commands:\n\`/ticket add\` -  Add a user to your ticket.\n\`/ticket claim\` - Claim a ticket to let other staff know you are handling the ticket.\n\`/ticket close\` - Close a ticket.\n\`/ticket create\` - Create a ticket.\n\`/ticket delete\` - Delete a ticket.\n\`/ticket help\` - Receive help about the tickets module.\n\`/ticket info\` - Receive information about a ticket.\n\`/ticket transfer\` - Transfer the ticket's ownership to another user.\n\`/ticket remove\` - Remove a user from your ticket.\n\`/ticket rename\` - Change the topic of your ticket.\n\`/ticket reopen\` - Reopen a closed ticket.\n\`/ticket transcript\` - Receive a ticket transcript.\n\`/ticket unclaim\` - Unclaim a ticket.\n\nFor staff members: Tickets can be configured on the [dashboard](https://quabot.net/dashboard/${interaction.guildId}/modules/tickets).`,
          ),
      ],
    });
  },
};
