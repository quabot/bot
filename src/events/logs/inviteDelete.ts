import { Events, Colors, Invite, ChannelType } from 'discord.js';
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

    if (!config.events!.includes('inviteCreate')) return;

    if (!invite.channel) return;
    if (config.excludedChannels!.includes(invite.channel.id)) return;
    if (invite.channel.type !== ChannelType.GroupDM) {
      if (invite.channel.parentId && config.excludedCategories!.includes(invite.channel.parentId)) return;
    }

    if (!('channels' in invite.guild)) return;
    const channel = invite.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;
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
