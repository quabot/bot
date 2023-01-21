const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType } = require('discord.js');
const { channelTypes } = require('../../../utils/constants/discord');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
    parent: 'info',
    name: 'channel',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const channel = interaction.options.getChannel('channel') ?? interaction.channel;

        await interaction.editReply({
            embeds: [
                new Embed(color).setTitle('Channel Info').setDescription(`
                    **• Name:** ${channel?.name}
                    **• Channel:** ${channel}
                    **• ID:** ${channel?.id}
                    **• Type:** ${channelTypes[channel?.type]}
                    **• NSFW:** ${channel?.nsfw ? 'Enabled' : 'Disabled'}
                    **• Ratelimit:** ${channel?.rateLimitPerUser !== 0 ? 'Enabled' : 'Disabled'}
                    **• Parent:** ${channel?.parentId ? '<#' + channel?.parentId + '>' : 'None'}
                    `),
            ],
        });
    },
};
