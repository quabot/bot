import { Events, Colors, GuildMember, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.GuildMemberUpdate,
  name: 'roleAddRemove',

  async execute({ client }: EventArgs, oldMember: GuildMember, newMember: GuildMember) {
    if (!newMember.guild.id) return;

    const config = await getLoggingConfig(client, oldMember.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('roleAddRemove')) return;

    if (oldMember.nickname !== newMember.nickname) return;
    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
    if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
    if (oldMember.avatar !== newMember.avatar) return;

    const channel = oldMember.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

    const moreRoles = oldMember.roles.cache.size > newMember.roles.cache.size;

    let role;
    if (oldMember.roles.cache.size < newMember.roles.cache.size)
      role = newMember.roles.cache
        .filter(n => !oldMember.roles.cache.has(n.id))
        .map(r => r.toString())
        .join('');
    if (moreRoles)
      role = oldMember.roles.cache
        .filter(n => !newMember.roles.cache.has(n.id))
        .map(r => r.toString())
        .join('');

    if (!role) return;

    await channel.send({
      embeds: [
        new Embed(moreRoles ? Colors.Green : Colors.Red)
          .setDescription(
            `
                        **Role(s) ${moreRoles ? 'Removed' : 'Given'}**
                        **User:** ${newMember}
                        ${role}
                        `,
          )
          .setFooter({
            text: `${newMember.user.username}`,
            iconURL: `${newMember.user.displayAvatarURL({ forceStatic: false })}`,
          }),
      ],
    });
  },
};
