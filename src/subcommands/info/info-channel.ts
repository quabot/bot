import { ChannelTypes } from '../../utils';
import { Subcommand, type CommandArgs, Embed } from '../../structures';

export default new Subcommand()
    .setParent('info')
    .setName('channel')
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        const channel: any = interaction.options.getChannel('channel') ?? interaction.channel;

        await interaction.editReply({
            embeds: [
                new Embed(color).setTitle('Channel Info').setDescription(`
                **• Name:** ${channel?.name}
                **• Channel:** ${channel}
                **• ID:** ${channel?.id}
                **• Type:** ${ChannelTypes[channel?.type]}
                **• NSFW:** ${channel?.nsfw ? 'Enabled' : 'Disabled'}
                **• Ratelimit:** ${channel?.rateLimitPerUser !== 0 ? 'Enabled' : 'Disabled'}
                **• Parent:** ${channel?.parentId ? '<#' + channel?.parentId + '>' : 'None'}
                `),
            ],
        });
    });
