import { Events, Colors, GuildMember } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildMemberRemove,
  name: 'guildMemberRemove',

  async execute({ client }: EventArgs, member: GuildMember) {
    if (!member.guild?.id) return;

    const config = await getLoggingConfig(client, member.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    const event = config.events?.find(event => event.event === 'guildMemberRemove');
    if (!event) return;

    if (!event.enabled) return;

    const channel = member.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Green).setDescription(`
                        **User Left**
                        @${member.user.username}
                        `),
        ],
      })
      .catch(() => {});
  },
};
