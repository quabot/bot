import type { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';
import { channelTypes } from '../../utils/constants/discord';
import Embed from '../../utils/constants/embeds';

module.exports = {
    parent: 'info',
    name: 'channel',
    async execute(_client: Client, interaction: ChatInputCommandInteraction, color: ColorResolvable) {
        await interaction.deferReply();

        const channel: any = interaction.options.getChannel('channel') ?? interaction.channel;

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
