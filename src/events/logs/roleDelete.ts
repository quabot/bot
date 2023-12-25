import { Events, Role } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildRoleDelete,
  name: 'roleDelete',

  async execute({ client }: EventArgs, role: Role) {
    if (!role.guild.id) return;

    const config = await getLoggingConfig(client, role.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('roleDelete')) return;

    const channel = role.guild.channels.cache.get(config.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    await channel
      .send({
        embeds: [
          new Embed(role.hexColor).setDescription(`
                        **Role Deleted**
                        @${role.name}
                        `),
        ],
      })
      .catch(() => {});
  },
};
