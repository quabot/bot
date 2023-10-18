import type { GuildMember } from 'discord.js';
import Level from '@schemas/Level';

export default {
  event: 'guildMemberRemove',
  name: 'levelEnable',

  async execute({}, member: GuildMember) {
    const user = await Level.findOne({
      guildId: member.guild.id,
      userId: member.id,
    });
    if (user) user.active = true;
  },
};
