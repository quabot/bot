const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
    parent: 'info',
    name: 'server',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const { guild } = interaction;
        const totalMembersSize = guild.members.cache.size;
        const humanMembersSize = guild.members.cache.filter(m => !m.user.bot).size;

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(guild.iconURL())
                    .setTitle('Server Info')
                    .addFields(
                        {
                            name: '**General:**',
                            value: `
                         **• Name**: ${guild.name}
                         **• ID**: ${guild.id}
                         **• Created**: <t:${Math.floor(guild.createdTimestamp / 1000)}:R>
                         **• Owner**: <@${guild.ownerId}>
                         **• Description**: ${guild.description ?? 'Unset'}
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
                            **• Total**: ${guild.channels.cache.size}
                            **• Text**: ${guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size}
                            **• Categories**: ${guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size
                                }
                            **• Voice**: ${guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size}${guild.features.includes('COMMUNITY')
                                    ? `\n**• News**: ${guild.channels.cache.filter(c => c.type === ChannelType.GuildAnnouncement)
                                        .size
                                    }
                                    **• Stages**: ${guild.channels.cache.filter(c => c.type === ChannelType.GuildStageVoice).size
                                    }`
                                    : ''
                                }
                            **• Threads**: ${guild.channels.cache.filter(c => c.type === ChannelType.PublicThread).size +
                                guild.channels.cache.filter(c => c.type === ChannelType.PrivateThread).size
                                }
                    `,
                            inline: false,
                        }
                    ),
            ],
        });
    },
};
