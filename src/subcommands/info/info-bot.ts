import { cache } from '../..';
import { totalmem, freemem, cpus } from 'os';
import { Subcommand, type CommandArgs, Embed } from '../../structures';

export default new Subcommand()
    .setParent('info')
    .setName('bot')
    .setCallback(async ({ interaction, client, color }: CommandArgs) => {
        await interaction.deferReply();

        if (!cache.has('client-info'))
            cache.set('client-info', {
                djs: require('../../../package.json').dependencies['discord.js'],
                njs: process.version,
                cpu: cpus()[0].model,
                platform: process.platform.replace('win32', 'windows'),
            });

        const info: any = cache.get('client-info');

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setTitle(`${client.user?.username}`)
                    .setThumbnail(client.user?.displayAvatarURL() ?? '')
                    .addFields(
                        {
                            name: 'Memory Usage',
                            value: `\`${
                                Math.round(totalmem() / 1024 / 1024) - Math.round(freemem() / 1024 / 1024)
                            }MB/${Math.round(totalmem() / 1024 / 1024)}MB\``,
                            inline: true,
                        },
                        {
                            name: 'Uptime',
                            value: `<t:${Math.round((client.readyTimestamp ?? 0) / 1000)}:R>`,
                            inline: true,
                        },
                        { name: 'Ping', value: `\`${client.ws.ping}ms\``, inline: true },

                        { name: 'Users', value: `\`${client.users.cache.size.toLocaleString()}\``, inline: true },
                        {
                            name: 'Servers',
                            value: `\`${client.guilds.cache.size.toLocaleString()}\``,
                            inline: true,
                        },
                        { name: 'Channels', value: `\`${client.channels.cache.size.toLocaleString()}\``, inline: true },

                        { name: 'Discord.js', value: `\`${info.djs}\``, inline: true },
                        { name: 'Node.js', value: `\`${info.njs}\``, inline: true },
                        { name: 'Version', value: `\`${require('../../../package.json').version}\``, inline: true },

                        { name: 'Platform', value: `\`${info.platform}\``, inline: true },
                        { name: 'Website', value: `[quabot.net](https://quabot.net)`, inline: true },
                        { name: 'CPU', value: `\`\`\`${info.cpu}\`\`\``, inline: true }
                    ),
            ],
        });
    });
