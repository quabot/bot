import { GuildBasedChannel, GuildChannel, PermissionsBitField } from 'discord.js';

export function hasSendPerms(channel: GuildBasedChannel | GuildChannel | null) {
  const member = channel?.guild.members.me;
  if (!member) return false;

  return channel.permissionsFor(member).has(PermissionsBitField.Flags.SendMessages);
}
