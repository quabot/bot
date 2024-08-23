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

    const event = config.events?.find(event => event.event === 'roleDelete');
    if (!event) return;

    if (!event.enabled) return;;

    const channel = role.guild.channels.cache.get(event.channelId);
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
