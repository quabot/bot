import { ChannelType } from 'discord.js';
import { Subcommand, Embed, type CommandArgs } from '../../structures';

export default new Subcommand()
    .setParent('info')
    .setName('server')
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        const { guild } = interaction;
        const totalMembersSize = guild?.members.cache.size ?? 0;
        const humanMembersSize = guild?.members.cache.filter(m => !m.user.bot).size ?? 0;

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(guild!.iconURL())
                    .setTitle('Server Info')
                    .addFields(
                        {
                            name: '**General:**',
                            value: `
                     **• Name**: ${guild?.name}
                     **• ID**: ${guild?.id}
                     **• Created**: <t:${Math.floor((guild?.createdTimestamp ?? 0) / 1000)}:R>
                     **• Owner**: <@${guild?.ownerId}>
                     **• Description**: ${guild?.description ?? 'Unset'}
                     `,
                            inline: false,
                        },
                        {
                            name: '**Members**',
                            value: `
                     **• Total Members**: ${totalMembersSize}
                     **• Humans**: ${humanMembersSize}
                     **• Bots**: ${totalMembersSize - humanMembersSize}
                     `,
                            inline: false,
                        },
                        {
                            name: '**Channels:**',
                            value: `
                        **• Total**: ${guild?.channels.cache.size}
                        **• Text**: ${guild?.channels.cache.filter(c => c.type === ChannelType.GuildText).size}
                        **• Categories**: ${
                            guild?.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size
                        }
                        **• Voice**: ${guild?.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size}${
                                guild?.features.includes('COMMUNITY')
                                    ? `\n**• News**: ${
                                          guild?.channels.cache.filter(c => c.type === ChannelType.GuildAnnouncement)
                                              .size
                                      }
                                **• Stages**: ${
                                    guild?.channels.cache.filter(c => c.type === ChannelType.GuildStageVoice).size
                                }`
                                    : ''
                            }
                        **• Threads**: ${
                            (guild?.channels.cache.filter(c => c.type === ChannelType.PublicThread).size ?? 0) +
                            (guild?.channels.cache.filter(c => c.type === ChannelType.PrivateThread).size ?? 0)
                        }
                `,
                            inline: false,
                        }
                    ),
            ],
        });
    });
