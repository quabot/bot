import { Events, GuildBan, Colors, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.GuildBanAdd,
  name: 'guildBanAdd',

  async execute({ client }: EventArgs, ban: GuildBan) {
    if (!ban.guild.id) return;

    const config = await getLoggingConfig(client, ban.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('guildBanAdd')) return;

    const channel = ban.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

    await channel.send({
      embeds: [
        new Embed(Colors.Red)
          .setDescription(
            `
                        **Member Banned**
                        ${ban.user} (${ban.user.username})
                        `,
          )
          .setFooter({
            text: `${ban.user.username}`,
            iconURL: `${ban.user.displayAvatarURL({ forceStatic: false })}`,
          }),
      ],
    });
  },
};
