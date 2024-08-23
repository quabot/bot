import { Events, Colors, Invite } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.InviteCreate,
  name: 'inviteCreate',

  async execute({ client }: EventArgs, invite: Invite) {
    if (!invite.guild?.id) return;

    const config = await getLoggingConfig(client, invite.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!invite.inviter) return;
    if (invite.inviter.bot && !config.logBotActions) return;

    const event = config.events?.find(event => event.event === 'inviteCreate');
    if (!event) return;

    if (!event.enabled) return;

    if (!invite.channel) return;
    if (config.excludedChannels!.includes(invite.channel.id)) return;
    if (!invite.channel.isDMBased()) {
      if (invite.channel.parentId && config.excludedCategories!.includes(invite.channel.parentId)) return;
    }

    if (!('channels' in invite.guild)) return;
    const channel = invite.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Green).setDescription(`**Invite Created**
                        [discord*.*gg/${invite.code}](https://discord.gg/${invite.code})
                        ${invite.inviter} - ${invite.channel}

                        **Expires in:**
                        ${!invite.maxAge ? 'Never' : `<t:${Math.floor(new Date().getTime() / 1000 + invite.maxAge)}:R>`}
                        `),
        ],
      })
      .catch(() => {});
  },
};
