import { Events, Colors, Invite } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.InviteDelete,
  name: 'inviteDelete',

  async execute({ client }: EventArgs, invite: Invite) {
    if (!invite.guild?.id) return;

    const config = await getLoggingConfig(client, invite.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    const event = config.events?.find(event => event.event === 'inviteDelete');
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
          new Embed(Colors.Red).setDescription(`
                    **Invite Deleted**
                    discord.gg/${invite.code}
                    ${invite.channel}`),
        ],
      })
      .catch(() => {});
  },
};
