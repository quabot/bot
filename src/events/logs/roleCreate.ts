import { Events, Colors, Role, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.GuildRoleCreate,
  name: 'roleCreate',

  async execute({ client }: EventArgs, role: Role) {
    if (!role.guild?.id) return;

    const config = await getLoggingConfig(client, role.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('roleCreate')) return;

    const channel = role.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

    let description = '';
    const perms = role.permissions.toArray().join('\n');
    const permsLength = String(perms);
    if (permsLength.length < 970 && permsLength.length !== 0) description += `\n**Permissions:**\n${perms}`;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Green)
            .setDescription(
              `
                        **Role Created**
                        ${role}
                        ${description}
                        `,
            )
            .setFooter({ text: `@${role.name}` }),
        ],
      })
      .catch(() => {});
  },
};
