import { ChannelType, Client, CommandInteraction } from 'discord.js';
import { embed } from '../../utils/constants/embeds';

module.exports = {
    command: 'info',
    subcommand: 'server',
    async execute(client: Client, interaction: CommandInteraction, color: any) {
        await interaction.deferReply();

        const infoEmbed = embed(color)
            .setThumbnail(interaction.guild!.iconURL())
            .setTitle('Server Info')
            .addFields(
                {
                    name: '**General:**',
                    value: `
                     **• Name**: ${interaction.guild!.name}
                     **• ID**: ${interaction.guild!.id}
                     **• Created**: <t:${Math.floor(interaction.guild!.createdTimestamp / 1000)}:R>
                     **• Owner**: <@${interaction.guild!.ownerId}>
                     **• Description**: ${interaction.guild!.description || 'Unset'}
                     `,
                    inline: false,
                },
                {
                    name: '**Members**',
                    value: `
                     **• Total Members**: ${interaction.guild!.members.cache.size}
                     **• Humans**: ${interaction.guild!.members.cache.filter(m => !m.user.bot).size}
                     **• Bots**: ${interaction.guild!.members.cache.filter(m => m.user.bot).size}
                     `,
                    inline: false,
                }
            );

        if (interaction.guild!.features.includes('COMMUNITY')) {
            infoEmbed.addFields({
                name: '**Channels:**',
                value: `
                        **• Total**: ${interaction.guild!.channels.cache.size}
                        **• Text**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildText).size
                        }
                        **• Categories**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size
                        }
                        **• Voice**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size
                        }
                        **• News**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildNews).size
                        }
                        **• Stages**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildStageVoice).size
                        }
                        **• Threads**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.PublicThread).size +
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.PrivateThread).size
                        }
                `,
                inline: false,
            });
        } else {
            infoEmbed.addFields({
                name: '**Channels:**',
                value: `
                        **• Total**: ${interaction.guild!.channels.cache.size}
                        **• Text**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildText).size
                        }
                        **• Categories**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size
                        }
                        **• Voice**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size
                        }
                        **• Threads**: ${
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.PublicThread).size +
                            interaction.guild!.channels.cache.filter(c => c.type === ChannelType.PrivateThread).size
                        }
                                 `,
                inline: false,
            });
        }

        await interaction.editReply({
            embeds: [infoEmbed],
        });
    },
};
