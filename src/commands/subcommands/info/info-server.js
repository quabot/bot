const { Interaction, EmbedBuilder, Client, ChannelType } = require('discord.js');

module.exports = {
    name: "server",
    command: "info",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch(() => null);

        const embed = new EmbedBuilder()
            .setTitle(`Server Info`)
            .setColor(color)
            .setThumbnail(interaction.guild.iconURL({ dynamic: false, size: 1024 }))
            .addFields(
                {
                    name: "**General:**",
                    value:
                        `
                         **• Name**: ${interaction.guild.name}
                         **• ID**: ${interaction.guild.id}
                         **• Created**: <t:${Math.floor(parseInt(interaction.guild.createdTimestamp / 1000))}:R>
                         **• Owner**: <@${interaction.guild.ownerId}>
                         **• Description**: ${interaction.guild.description || "None"}
                         `,
                    inline: true,

                }, {
                name: "**Members**",
                value:
                    `
                         **• Total Members**: ${interaction.guild.members.cache.size}
                         **• Humans**: ${interaction.guild.members.cache.filter((m) => !m.user.bot).size}
                         **• Bots**: ${interaction.guild.members.cache.filter((m) => m.user.bot).size}
                         `,
                inline: false,

            }
            )
            .setTimestamp();

        if (interaction.guild.features.includes("COMMUNITY")) {
            embed.addFields(
                {
                    name: "**Channels:**",
                    value:
                        `
                                 **• Total**: ${interaction.guild.channels.cache.size}
                                 **• Text**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size}
                                 **• Categories**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size}
                                 **• Voice**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size}
                                 **• News**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildNews).size}
                                 **• Stages**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size}
                                 **• Threads**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPublicThread).size + interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPrivateThread).size}
                                 `,
                    inline: false,
                }
            );
        } else {
            embed.addFields(
                {
                    name: "**Channels:**",
                    value:
                        `
                                 **• Total**: ${interaction.guild.channels.cache.size}
                                 **• Text**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size}
                                 **• Categories**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size}
                                 **• Voice**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size}
                                 **• Threads**: ${interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPublicThread).size + interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPrivateThread).size}
                                 `,
                    inline: false,
                }
            );
        }

        interaction.editReply({
            embeds: [embed]
        }).catch(() => null);
    }
}