import { Events, Role, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

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
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

    let description = '';
    const perms = role.permissions.toArray().join('\n');
    const permsLength = String(perms);
    if (permsLength.length < 970 && permsLength.length !== 0) description += `\n**Permissions:**\n${perms}`;

    await channel.send({
      embeds: [
        new Embed(role.hexColor).setDescription(`
                        **Role Deleted**
                        @${role.name}
                        `),
      ],
    });
  },
};
