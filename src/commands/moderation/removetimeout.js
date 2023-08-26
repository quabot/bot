const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits } = require('discord.js');
const { getModerationConfig } = require('@configs/moderationConfig');
const { getUser } = require('@configs/user');
const { Embed } = require('@constants/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removetimeout')
    .setDescription('Remove the timeout from a user.')
    .addUserOption(option =>
      option.setName('user').setDescription('The user you wish to remove the timeout from.').setRequired(true),
    )
    .addBooleanOption(option =>
      option.setName('private').setDescription('Should the message be visible to you only?').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction, color) {
    const private = interaction.options.getBoolean('private') ?? false;

    await interaction.deferReply({ ephemeral: private });

    const config = await getModerationConfig(client, interaction.guildId);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up moderation for first-time use! Please run the command again.",
          ),
        ],
      });

    const member = interaction.options.getMember('user');
    await getUser(interaction.guildId, member.id);

    if (!member)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
      });

    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot remove a timeout from yourself.')],
      });

    if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition)
      return interaction.editReply({
        embeds: [
          new Embed(color).setDescription('You cannot remove a timeout from a user with roles higher than your own.'),
        ],
      });

    let timeout = true;
    await member.timeout(1, `Timeout removed by @${interaction.user.username}`).catch(async e => {
      timeout = false;

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to remove the timeout from the user.')],
      });
    });

    if (!timeout) return;

    interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Timeout Removed')
          .setDescription(`**User:** ${member} (@${member.user.username})`)
          .addFields(
            {
              name: 'Joined Server',
              value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: 'Account Created',
              value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
          ),
      ],
    });

    if (config.channel) {
      const channel = interaction.guild.channels.cache.get(config.channelId);
      if (!channel) return;

      await channel.send({
        embeds: [
          new Embed(color).setTitle('Member Timeout Removed').addFields(
            {
              name: 'User',
              value: `${member} (@${member.user.username})`,
              inline: true,
            },
            { name: 'Removed By', value: `${interaction.user}`, inline: true },
            {
              name: 'Removed In',
              value: `${interaction.channel}`,
              inline: true,
            },
            {
              name: 'Joined Server',
              value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: 'Account Created',
              value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
          ),
        ],
      });
    }
  },
};
