import type { GuildMember } from 'discord.js';
import Level from '@schemas/Level';
import { getLevelConfig } from '@configs/levelConfig';
import { EventArgs } from '@typings/functionArgs';

export default {
  event: 'guildMemberRemove',
  name: 'levelDisabnle',
  async execute({ client }: EventArgs, member: GuildMember) {
    const user = await Level.findOne({
      guildId: member.guild.id,
      userId: member.id,
    });
    if (user) user.active = false;
    if (user) await user.save();

    const config = await getLevelConfig(member.guild.id, client);
    if (!config) return;
    if (!config.enabled) return;
    if (config.resetOnLeave) {
      await Level.deleteOne({
        guildId: member.guild.id,
        userId: member.id,
      });
    }
  },
};
