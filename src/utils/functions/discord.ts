import type { APIInteractionGuildMember, Embed, GuildMember, GuildMemberRoleManager, Snowflake } from 'discord.js';

export function prepareEmbed(embed: Embed) {
  const res = { ...(embed as DeepWriteable<Embed>) };
  if (embed.data.description === '\u200b') delete res.data.description;

  return res;
}

export function hasAnyRole(member: GuildMember | APIInteractionGuildMember | null, query: Snowflake[]) {
  const roles = getRoleIds(member);

  return query.map(manager => roles.includes(manager)).some(v => v === true);
}

export function getRoleIds(member: GuildMember | APIInteractionGuildMember | null) {
  if (!member) return [];

  return 'cache' in member.roles ? (member.roles as GuildMemberRoleManager).cache.map(r => r.id) : member.roles;
}
