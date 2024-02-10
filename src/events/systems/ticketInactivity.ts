import type { EventArgs } from '@typings/functionArgs';
import Ticket from '@schemas/Ticket';
import { getTicketConfig } from '@configs/ticketConfig';
import { GuildTextBasedChannel } from 'discord.js';

export default {
  event: 'ready',
  name: 'ticketInactivity',
  once: true,

  async execute({ client }: EventArgs) {
    setInterval(
      () => {
        const now = new Date().getHours() / 24;
        client.guilds.cache.forEach(async g => {
          const config = await getTicketConfig(client, g.id);
          if (!config || config.inactiveDaysToDelete <= 0) return;

          const tickets = await Ticket.find({ guildId: g.id, closed: false });
          tickets.forEach(async t => {
            const channel = g.channels.cache.get(t.channelId) as GuildTextBasedChannel | undefined;
            if (!channel?.lastMessageId) return;
            const lastMessage = channel.messages.cache.get(channel.lastMessageId);
            if (!lastMessage) return;
            const time = (lastMessage.editedAt ?? lastMessage.createdAt).getHours() / 24;

            if (now - time >= config.inactiveDaysToDelete) await channel.delete();
          });
        });
      },
      60 * 60 * 1_000,
    );
  },
};
