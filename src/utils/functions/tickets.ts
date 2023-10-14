import { ITicket } from '@typings/schemas';
import { APIInteractionGuildMember, GuildMember, PermissionFlagsBits, User } from 'discord.js';

export function checkUserPerms(
  ticket: ITicket,
  user: User,
  member?: GuildMember | APIInteractionGuildMember | undefined | null,
) {
  return (
    ticket.owner === user.id ||
    ticket.users!.includes(user.id) ||
    (typeof member?.permissions === 'object' &&
      (member.permissions.has(PermissionFlagsBits.Administrator) ||
        member.permissions.has(PermissionFlagsBits.ManageChannels) ||
        member.permissions.has(PermissionFlagsBits.ManageGuild)))
  );
}
