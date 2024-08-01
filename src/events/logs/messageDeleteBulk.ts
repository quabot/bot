import { Collection, Events, GuildTextBasedChannel, Message, Snowflake } from 'discord.js';
import messageDeleteEvent from './messageDelete';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.MessageBulkDelete,
  name: 'messageDeleteBulk',

  async execute({ client }: EventArgs, messages: Collection<Snowflake, Message>, channel: GuildTextBasedChannel) {
    if (!channel.guild.id) return; 

    messages.reverse().forEach(m => messageDeleteEvent.execute({ client }, m));
  },
};
