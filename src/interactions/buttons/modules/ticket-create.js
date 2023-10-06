const {
  Client,
  ButtonInteraction,
  ColorResolvable,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ChannelType,
} = require('discord.js');
const Ticket = require('@schemas/Ticket');
const { getIdConfig } = require('@configs/idConfig');
const { getTicketConfig } = require('@configs/ticketConfig');
const { Embed } = require('@constants/embed');

module.exports = {
  name: 'ticket-create',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    const config = await getTicketConfig(client, interaction.guildId);
    const ids = await getIdConfig(interaction.guildId);

    if (!config || !ids)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
        ephemeral: true,
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Tickets are disabled in this server.')],
        ephemeral: true,
      });

    let topic = 'No topic specified';
    if (config.topicButton) {
      const modal = new ModalBuilder()
        .setTitle('Ticket Topic')
        .setCustomId('ticket-topic')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('topic')
              .setLabel('Ticket Topic')
              .setMaxLength(500)
              .setMinLength(2)
              .setPlaceholder('Leave a topic...')
              .setRequired(true)
              .setStyle(TextInputStyle.Paragraph),
          ),
        );

      await interaction.showModal(modal);
      const modalResponse = await interaction
        .awaitModalSubmit({
          time: 60000,
          filter: i => i.user.id === interaction.user.id,
        })
        .catch(() => {});

      if (modalResponse && modalResponse.customId === 'ticket-topic')
        topic = modalResponse.fields.getTextInputValue('topic');
      if (!modalResponse) return;

      const category = interaction.guild.channels.cache.get(config.openCategory);
      if (!category || category.type !== ChannelType.GuildCategory)
        return await modalResponse.reply({
          embeds: [
            new Embed(color).setDescription(
              `Couldn't find any valid configured categories for tickets. You can do this on our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/modules/tickets).`,
            ),
          ],
          ephemeral: true,
        });

      const channel = await interaction.guild.channels.create({
        name: `ticket-${ids.ticketId}`,
        type: ChannelType.GuildText,
      });
      if (!channel)
        return await modalResponse.reply({
          embeds: [new Embed(color).setDescription('Failed to create the channel.')],
          ephemeral: true,
        });

      await channel.setParent(category, { lockPermissions: true });
      channel.permissionOverwrites.create(interaction.guild.id, {
        ViewChannel: false,
        SendMessages: false,
      });
      channel.permissionOverwrites.create(interaction.user.id, {
        ViewChannel: true,
        SendMessages: true,
      });

      config.staffRoles.forEach(r => {
        const role = interaction.guild.roles.cache.get(r);
        if (role)
          channel.permissionOverwrites.create(role, {
            ViewChannel: true,
            SendMessages: true,
          });
      });

      await channel.send({
        embeds: [
          new Embed(color)
            .setTitle('New Ticket')
            .setDescription('Please wait, staff will be with you shortly.')
            .addFields(
              { name: 'Topic', value: `${topic}`, inline: true },
              {
                name: 'Created By',
                value: `${interaction.user}`,
                inline: true,
              },
              { name: 'Claimed by', value: 'Not claimed yet', inline: true },
            ),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close-ticket').setLabel('🔒 Close').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('claim-ticket').setLabel('🙋‍♂️ Claim').setStyle(ButtonStyle.Secondary),
          ),
        ],
      });

      const pingRole = interaction.guild.roles.cache.get(config.staffPing);
      if (pingRole) await channel.send(`${pingRole}`);

      const newTicket = new Ticket({
        guildId: interaction.guildId,

        id: ids.ticketId,
        channelId: channel.id,

        topic,
        closed: false,

        owner: interaction.user.id,
        users: [],
        staff: 'none',
      });
      await newTicket.save();

      await modalResponse.reply({
        embeds: [
          new Embed(color)
            .setTitle('Ticket created!')
            .setDescription(`Check it out here: ${channel}, staff will be with you shortly.`),
        ],
        ephemeral: true,
      });

      const logChannel = interaction.guild.channels.cache.get(config.logChannel);
      if (logChannel)
        await logChannel.send({
          embeds: [
            new Embed(color)
              .setTitle('Ticket Created')
              .addFields(
                { name: 'User', value: `${interaction.user}`, inline: true },
                {
                  name: 'Channel',
                  value: `${interaction.channel}`,
                  inline: true,
                },
                { name: 'Topic', value: `${topic}`, inline: true },
              )
              .setFooter({ text: `ID: ${ids.ticketId}` }),
          ],
        });

      ids.ticketId += 1;
      await ids.save();

      return;
    }

    const category = interaction.guild.channels.cache.get(config.openCategory);
    if (!category || category.type !== ChannelType.GuildCategory)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            `Couldn't find any valid configured categories for tickets. You can do this on our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/modules/tickets).`,
          ),
        ],
        ephemeral: true,
      });

    const channel = await interaction.guild.channels.create({
      name: `ticket-${ids.ticketId}`,
      type: ChannelType.GuildText,
    });
    if (!channel)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Failed to create the channel.')],
        ephemeral: true,
      });

    await channel.setParent(category, { lockPermissions: true });
    channel.permissionOverwrites.create(interaction.guild.id, {
      ViewChannel: false,
      SendMessages: false,
    });
    channel.permissionOverwrites.create(interaction.user.id, {
      ViewChannel: true,
      SendMessages: true,
    });

    config.staffRoles.forEach(r => {
      const role = interaction.guild.roles.cache.get(r);
      if (role)
        channel.permissionOverwrites.create(role, {
          ViewChannel: true,
          SendMessages: true,
        });
    });

    await channel.send({
      embeds: [
        new Embed(color)
          .setTitle('New Ticket')
          .setDescription('Please wait, staff will be with you shortly.')
          .addFields(
            { name: 'Topic', value: `${topic}`, inline: true },
            { name: 'Created By', value: `${interaction.user}`, inline: true },
            { name: 'Claimed by', value: 'Not claimed yet', inline: true },
          ),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('close-ticket').setLabel('🔒 Close').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('claim-ticket').setLabel('🙋‍♂️ Claim').setStyle(ButtonStyle.Secondary),
        ),
      ],
    });

    const pingRole = interaction.guild.roles.cache.get(config.staffPing);
    if (pingRole) await channel.send(`${pingRole}`);

    const newTicket = new Ticket({
      guildId: interaction.guildId,

      id: ids.ticketId,
      channelId: channel.id,

      topic,
      closed: false,

      owner: interaction.user.id,
      users: [],
      staff: 'none',
    });
    await newTicket.save();

    await interaction.reply({
      embeds: [
        new Embed(color)
          .setTitle('Ticket created!')
          .setDescription(`Check it out here: ${channel}, staff will be with you shortly.`),
      ],
      ephemeral: true,
    });

    const logChannel = interaction.guild.channels.cache.get(config.logChannel);
    if (logChannel)
      await logChannel.send({
        embeds: [
          new Embed(color)
            .setTitle('Ticket Created')
            .addFields(
              { name: 'User', value: `${interaction.user}`, inline: true },
              {
                name: 'Channel',
                value: `${interaction.channel}`,
                inline: true,
              },
              { name: 'Topic', value: `${topic}`, inline: true },
            )
            .setFooter({ text: `ID: ${ids.ticketId}` }),
        ],
      });

    ids.ticketId += 1;
    await ids.save();
  },
};
