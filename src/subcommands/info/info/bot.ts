import { Embed } from '@constants/embed';
import { totalmem, freemem, cpus } from 'os';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'info',
  name: 'bot',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const packageContent = require('../../../../package.json');

    if (!client.cache.has('client-info'))
      client.cache.set('client-info', {
        djs: packageContent.dependencies['discord.js'],
        njs: process.version,
        cpu: cpus()[0].model,
        platform: process.platform.replace('win32', 'windows'),
        commands: client.commands.size,
      });

    const info = client.cache.get('client-info') as any;

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle(`${client.user?.username}`)
          .setThumbnail(client.user?.displayAvatarURL() ?? '')
          .addFields(
            {
              name: 'Online Since',
              value: `<t:${Math.round((client.readyTimestamp ?? 0) / 1000)}:R>`,
              inline: true,
            },
            { name: 'Ping', value: `\`${client.ws.ping}ms\``, inline: true },
            {
              name: 'Website',
              value: '[quabot.net](https://quabot.net)',
              inline: true,
            },

            {
              name: 'Users',
              value: `\`${client.users.cache.size.toLocaleString()}\``,
              inline: true,
            },
            {
              name: 'Servers',
              value: `\`${client.guilds.cache.size.toLocaleString()}\``,
              inline: true,
            },
            {
              name: 'Channels',
              value: `\`${client.channels.cache.size.toLocaleString()}\``,
              inline: true,
            },

            { name: 'Discord.js', value: `\`${info.djs}\``, inline: true },
            { name: 'Node.js', value: `\`${info.njs}\``, inline: true },
            {
              name: 'Version',
              value: `\`${packageContent.version}\``,
              inline: true,
            },

            { name: 'Platform', value: `\`${info.platform}\``, inline: true },
            {
              name: 'Memory Usage',
              value: `\`${Math.round(totalmem() / 1024 / 1024) - Math.round(freemem() / 1024 / 1024)}MB/${Math.round(
                totalmem() / 1024 / 1024,
              )}MB\``,
              inline: true,
            },
            { name: 'Commands', value: `\`${info.commands}\``, inline: true },

            { name: 'CPU', value: `\`\`\`${info.cpu}\`\`\`` },
          ),
      ],
    });
  },
};
