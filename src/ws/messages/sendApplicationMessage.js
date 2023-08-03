
//* QuaBot Applications Message Sender Handler.
module.exports = {
    code: 'send-message-applications',
    async execute(client, data) {
    
      //* Ge the guild, channel, id and embed.
      const guild = client.guilds.cache.get(data.guildId);
      if (!guild) return;
      const channel = guild.channels.cache.get(data.channelId);
      if (!channel) return;

      const embed = data.embed;
      const applicationId = data.id;
      if (!applicationId) return;

      //* Send the message.
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('applications-fill-' + applicationId)
            .setLabel('Apply')
            .setStyle(ButtonStyle.Primary)
        )

      if (!embed) return await channel.send({ content: data.message.content, components: [row] });

      const sentEmbed = new CustomEmbed(data.message, (e) => { return e });

      await channel.send({ embeds: [sentEmbed], content: data.message.content ?? '', components: [row] })
    
    }
}