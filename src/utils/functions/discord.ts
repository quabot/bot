import {
  PermissionsBitField,
  type APIInteractionGuildMember,
  type Embed,
  type GuildMember,
  type GuildMemberRoleManager,
  type Snowflake,
  APIInteractionDataResolvedGuildMember,
} from 'discord.js';

export function prepareEmbed(embed: Embed) {
  const res = { ...(embed as DeepWriteable<Embed>) };
  if (embed.data.description === '\u200b') delete res.data.description;

  return res;
}

export function hasAnyRole(
  member: GuildMember | APIInteractionGuildMember | null | undefined | APIInteractionDataResolvedGuildMember,
  query: Snowflake[],
) {
  const roles = getRoleIds(member);

  return query.map(manager => roles.includes(manager)).some(v => v === true);
}

export function getRoleIds(
  member: GuildMember | APIInteractionGuildMember | null | undefined | APIInteractionDataResolvedGuildMember,
) {
  if (!member) return [];

  return 'cache' in member.roles ? (member.roles as GuildMemberRoleManager).cache.map(r => r.id) : member.roles;
}

export function hasAnyPerms(member: GuildMember | APIInteractionGuildMember | null | undefined, perms: bigint[]) {
  return (
    typeof member?.permissions === 'object' &&
    perms.map(p => (member.permissions as PermissionsBitField).has(p)).some(v => v === true)
  );
}
