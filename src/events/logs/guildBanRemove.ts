import { Events, GuildBan, Colors } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildBanRemove,
  name: 'guildBanRemove',

  async execute({ client }: EventArgs, ban: GuildBan) {
    if (!ban.guild.id) return;

    const config = await getLoggingConfig(client, ban.guild.id);
    if (!config) return;
    if (!config.enabled) return;


    const event = config.events?.find(event => event.event === 'guildBanRemove');
    if (!event) return;

    if (!event.enabled) return;

    const channel = ban.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Green)
            .setDescription(
              `
                        **Member Unbanned**
                        ${ban.user} (${ban.user.username})
                        `,
            )
            .setFooter({
              text: `${ban.user.username}`,
              iconURL: `${ban.user.displayAvatarURL({ forceStatic: false })}`,
            }),
        ],
      })
      .catch(() => {});
  },
};
