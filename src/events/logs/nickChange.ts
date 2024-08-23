import { Events, Colors, GuildMember } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildMemberUpdate,
  name: 'nickChange',

  async execute({ client }: EventArgs, oldMember: GuildMember, newMember: GuildMember) {
    if (!newMember.guild.id) return;

    const config = await getLoggingConfig(client, oldMember.guild.id);
    if (!config) return;
    if (!config.enabled) return;
    if (!config.logBotActions && newMember.user.bot) return;

    const event = config.events?.find(event => event.event === 'nickChange');
    if (!event) return;

    if (!event.enabled) return;

    const channel = oldMember.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    if (oldMember.nickname === newMember.nickname) return;
    if (!oldMember.nickname && !newMember.nickname) return;
    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
    if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
    if (oldMember.avatar !== newMember.avatar) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Yellow)
            .setDescription(
              `
                        **Nickname Changed**
                        **User:** ${newMember}
                        ${oldMember.nickname ?? 'None'} -> ${newMember.nickname ?? 'None'}
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
