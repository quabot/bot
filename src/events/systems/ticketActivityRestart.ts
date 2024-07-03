import type { EventArgs } from '@typings/functionArgs';
import Ticket from '@schemas/Ticket';
import { getTicketConfig } from '@configs/ticketConfig';
import { ticketInactivity } from '@functions/ticket-inactivity';

export default {
  event: 'ready',
  name: 'ticketActivityRestart',
  once: true,

  async execute({ client }: EventArgs) {
    const Tickets = await Ticket.find({
      closed: false
    });

    Tickets.forEach(async ticket => {
      const config = await getTicketConfig(client, ticket.guildId);
      if (!config) return;
      if (!config.autoClose && !config.autoRemind) return;

      ticketInactivity(client, ticket);
    });
  },
};
