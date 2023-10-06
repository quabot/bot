const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('@constants/embed');
const { totalmem, freemem, cpus } = require('os');

module.exports = {
  parent: 'info',
  name: 'bot',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply();

    if (!client.cache.has('client-info'))
      client.cache.set('client-info', {
        djs: require('../../../../package.json').dependencies['discord.js'],
        njs: process.version,
        cpu: cpus()[0].model,
        platform: process.platform.replace('win32', 'windows'),
        commands: client.commands.size,
      });

    const info = client.cache.get('client-info');

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle(`${client.user.username}`)
          .setThumbnail(client.user.displayAvatarURL() ?? '')
          .addFields(
            {
              name: 'Uptime',
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
              value: `\`${require('../../../../package.json').version}\``,
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
            { name: 'Commands', value: `${info.commands}`, inline: true },

            { name: 'CPU', value: `\`\`\`${info.cpu}\`\`\``, inline: false },
          ),
      ],
    });
  },
};
