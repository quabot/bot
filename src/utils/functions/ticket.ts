import { ITicket } from '@typings/schemas';
import { APIInteractionGuildMember, GuildMember, PermissionFlagsBits, User } from 'discord.js';
import { hasAnyPerms } from './discord';

export function checkUserPerms(
  ticket: ITicket,
  user: User,
  member?: GuildMember | APIInteractionGuildMember | undefined | null,
) {
  return (
    ticket.owner === user.id ||
    ticket.users!.includes(user.id) ||
    hasAnyPerms(member, [
      PermissionFlagsBits.Administrator,
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageGuild,
    ])
  );
}
