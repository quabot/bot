const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CustomEmbed } = require('@constants/customEmbed');

//* QuaBot Ticket Message Sender Handler.
module.exports = {
  code: 'send-message-ticket',
  async execute(client, data) {
    //* Get the server and channel & embed.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    if (!channel) return;

    const embed = data.embedEnabled;

    //* Send the message to the channel.
    const getParsedString = s => {
      return `${s}`
        .replaceAll('{guild}', guild.name)
        .replaceAll('{members}', guild.memberCount)
        .replaceAll('{color}', '#416683');
    };
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket-create').setLabel('Create Ticket').setStyle(ButtonStyle.Secondary),
    );

    if (!embed)
      return await channel.send({
        content: getParsedString(data.message.content) ?? '',
        components: [row],
      });

    const sentEmbed = new CustomEmbed(data.message, getParsedString);

    await channel.send({
      embeds: [sentEmbed],
      content: getParsedString(data.message.content) ?? '',
      components: [row],
    });
  },
};
