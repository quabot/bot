import { ChannelType } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'info',
  name: 'server',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const { guild } = interaction;
    const totalMembersSize = guild?.members.cache.size ?? 0;
    const humanMembersSize = guild?.members.cache.filter(m => !m.user.bot).size ?? 0;

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setThumbnail(guild?.iconURL() ?? null)
          .setTitle('Server Info')
          .addFields(
            {
              name: '**General:**',
              value: `
                            - **Name**: ${guild?.name}\n- **ID**: ${guild?.id}\n- **Created**: <t:${Math.floor(
                              guild?.createdTimestamp ?? 0 / 1000,
                            )}:R>\n- **Owner**: <@${guild?.ownerId}>\n- **Description**: ${
                              guild?.description ?? 'Unset'
                            }
                         `,
            },
            {
              name: '**Members**',
              value: `
                         - **Total Members**: ${totalMembersSize}\n- **Humans**: ${humanMembersSize}\n- **Bots**: ${
                           totalMembersSize - humanMembersSize
                         }
                         `,
            },
            {
              name: '**Channels:**',
              value: `
                            - **Total**: ${guild?.channels.cache.size}\n- **Text**: ${guild?.channels.cache.filter(
                              c => c.type === ChannelType.GuildText,
                            ).size}\n- **Categories**: ${guild?.channels.cache.filter(
                              c => c.type === ChannelType.GuildCategory,
                            ).size}\n- **Voice**: ${guild?.channels.cache.filter(c => c.type === ChannelType.GuildVoice)
                              .size}
                                ${
                                  guild?.features.includes('COMMUNITY')
                                    ? `\n- **News**: ${guild?.channels.cache.filter(
                                        c => c.type === ChannelType.GuildAnnouncement,
                                      ).size}
                                    \n- **Stages**: ${guild?.channels.cache.filter(
                                      c => c.type === ChannelType.GuildStageVoice,
                                    ).size}`
                                    : ''
                                }\n- **Threads**: ${
                                  guild?.channels.cache.filter(c => c.type === ChannelType.PublicThread).size ??
                                  0 +
                                    (guild?.channels.cache.filter(c => c.type === ChannelType.PrivateThread).size ?? 0)
                                }
                    `,
            },
          ),
      ],
    });
  },
};
