import { Embed } from '@constants/embed';
import {
  PermissionsBitField,
  type APIInteractionGuildMember,
  type Embed as DiscordEmbed,
  type GuildMember,
  type GuildMemberRoleManager,
  type Snowflake,
  type APIInteractionDataResolvedGuildMember,
  EmbedBuilder,
  type GuildBasedChannel,
  type GuildChannel,
  Role,
  APIRole,
} from 'discord.js';

export function prepareEmbed(embed: DiscordEmbed) {
  const res = EmbedBuilder.from(embed);
  if (res.data.description === '\u200b') res.setDescription(null);

  return res;
}

export function fixEmbed(embed: Embed) {
  if (
    !(
      embed.data.title ||
      embed.data.image ||
      embed.data.thumbnail ||
      embed.data.footer ||
      embed.data.author ||
      embed.data.fields?.length
    )
  ) {
    embed.setDescription('\u200b');
  }

  return embed;
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

export function hasRolePerms(role: Role | APIRole | undefined | null) {
  if (!role || !('guild' in role)) return false;

  const member = role.guild.members.me;
  if (!member) return false;

  return !(member.roles.highest.comparePositionTo(role) < 1) && member.permissions.has('ManageRoles');
}

export function hasSendPerms(channel: GuildBasedChannel | GuildChannel | null) {
  const member = channel?.guild.members.me;
  if (!member) return false;

  return channel.permissionsFor(member).has(PermissionsBitField.Flags.SendMessages);
}

export function hasAnyPerms(member: GuildMember | APIInteractionGuildMember | null | undefined, perms: bigint[]) {
  return (
    typeof member?.permissions === 'object' &&
    perms.map(p => (member.permissions as PermissionsBitField).has(p)).some(v => v === true)
  );
}
