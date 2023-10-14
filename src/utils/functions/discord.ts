import type { APIInteractionGuildMember, Embed, GuildMember, GuildMemberRoleManager, Snowflake } from 'discord.js';

export function prepareEmbed(embed: Embed) {
  const res = { ...(embed as DeepWriteable<Embed>) };
  if (embed.data.description === '\u200b') delete res.data.description;

  return res;
}

export function hasAnyRole(member: GuildMember | APIInteractionGuildMember | null, roles: Snowflake[]) {
  return (
    !!member &&
    roles
      .map(manager => {
        const hasRole =
          'cache' in member.roles
            ? (member.roles as GuildMemberRoleManager).cache.get
            : (member.roles as Snowflake[]).includes;

        return !!hasRole(manager);
      })
      .some(v => v === true)
  );
}
