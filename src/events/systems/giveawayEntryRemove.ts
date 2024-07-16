import {
  type MessageReaction,
  type User } 
  from 'discord.js';
import Giveaway from '@schemas/Giveaway';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'messageReactionRemove',
  name: 'giveawayEntryRemove',

  async execute({  }: EventArgs, reaction: MessageReaction, user: User) {
    if (!reaction.message.guild?.id) return;
    if (reaction.emoji.name !== '🎉') return;

    const giveaway = await Giveaway.findOne({
      message: reaction.message.id,
    });
    if (!giveaway) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member) return;
    if (member.user.bot) return;

    //@ts-ignore
    if (!giveaway.entries.includes(member.id)) return;

    await giveaway.updateOne({  
      //@ts-ignore
      entries: giveaway.entries.filter((entry) => entry !== member.id),
    });
  },
};
