import type { GuildMember } from 'discord.js';
import Level from '@schemas/Level';

export default {
  event: 'guildMemberRemove',
  name: 'levelDisable',
  async execute({}, member: GuildMember) {
    const user = await Level.findOne({
      guildId: member.guild.id,
      userId: member.id,
    });
    console.log(user)
    if (user) user.active = false;
  },
};
