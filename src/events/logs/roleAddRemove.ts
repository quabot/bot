import { Events, Colors, GuildMember } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildMemberUpdate,
  name: 'roleAddRemove',

  async execute({ client }: EventArgs, oldMember: GuildMember, newMember: GuildMember) {
    if (!newMember.guild.id) return;

    const config = await getLoggingConfig(client, oldMember.guild.id);
    if (!config) return;
    if (!config.enabled) return;
    if (!config.logBotActions && newMember.user.bot) return;

    const event = config.events?.find(event => event.event === 'roleAddRemove');
    if (!event) return;

    if (!event.enabled) return;

    if (oldMember.nickname !== newMember.nickname) return;
    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
    if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
    if (oldMember.avatar !== newMember.avatar) return;

    const channel = oldMember.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

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

    await channel
      .send({
        embeds: [
          new Embed(moreRoles ? Colors.Red : Colors.Green)
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
      })
      .catch(() => {});
  },
};
