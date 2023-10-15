import type { GuildMember } from 'discord.js';
import Level from '@schemas/Level';

module.exports = {
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
