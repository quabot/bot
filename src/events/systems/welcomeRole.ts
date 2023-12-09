import { Events, type GuildMember } from 'discord.js';
import { getWelcomeConfig } from '@configs/welcomeConfig';
import type { EventArgs } from '@typings/functionArgs';
import { hasRolePerms } from '@functions/discord';

export default {
  event: Events.GuildMemberAdd,
  name: 'welcomeRole',

  async execute({ client }: EventArgs, member: GuildMember) {
    const config = await getWelcomeConfig(client, member.guild.id);
    if (!config) return;
    if (!config.joinRoleEnabled) return;

    config.joinRole?.forEach(role => {
      if (role.bot && member.user.bot) {
        const fRole = member.guild.roles.cache.get(role.role);
        if (!hasRolePerms(fRole)) return;

        setTimeout(() => {
          member.roles.add(fRole!).catch(() => {});
        }, role.delay);
      }

      const fRole = member.guild.roles.cache.get(role.role);
      if (!hasRolePerms(fRole)) return;

      setTimeout(() => {
        member.roles.add(fRole!).catch(() => {});
      }, role.delay);
    });
  },
};
