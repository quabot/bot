const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { getModerationConfig } = require('@configs/moderationConfig');
const { getUser } = require('@configs/user');
const { Embed } = require('@constants/embed');
const Punishment = require('@schemas/Punishment');
const { randomUUID } = require('crypto');
const { CustomEmbed } = require('@constants/customEmbed');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user.')
    .addUserOption(option => option.setName('user').setDescription('The user you wish to timeout.').setRequired(true))
    .addStringOption(option =>
      option.setName('duration').setDescription('How long should the user be timed out.').setRequired(true),
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('The reason for timing out the user.').setRequired(false),
    )
    .addBooleanOption(option =>
      option.setName('private').setDescription('Should the message be visible to you only?').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  
  async execute({ client, interaction, color }: CommandArgs) {
    const private = interaction.options.getBoolean('private') ?? false;

    await interaction.deferReply({ ephemeral: private });

    const config = await getModerationConfig(client, interaction.guildId);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "There was an error. Please try again.",
          ),
        ],
      });

    const reason = `${interaction.options.getString('reason') ?? 'No reason specified.'}`.slice(0, 800);
    const duration = interaction.options.getString('duration').slice(0, 800);
    const member = interaction.options.getMember('user');
    if (!member || !reason || !duration)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
      });
    await getUser(interaction.guildId, member.id);

    if (!ms(duration))
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'Please enter a valid duration. This could be "1d" for 1 day, "1w" for 1 week or "1hour" for 1 hour.',
          ),
        ],
      });

    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot timeout yourself.')],
      });

    if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot timeout a user with roles higher than your own.')],
      });

    const userDatabase = await getUser(interaction.guildId, member.id);
    if (!userDatabase)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('The user has been added to our database. Please run the command again.'),
        ],
      });

    let timeout = true;
    await member.timeout(ms(duration), reason).catch(async e => {
      timeout = false;

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to timeout the user.')],
      });
    });

    if (!timeout) return;

    userDatabase.timeouts += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: interaction.guildId,
      userId: member.id,

      channelId: interaction.channelId,
      moderatorId: interaction.user.id,
      time: new Date().getTime(),

      type: 'timeout',
      id,
      reason,
      duration,
      active: false,
    });
    await NewPunishment.save();

    interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Timed Out')
          .setDescription(`**User:** ${member} (@${member.user.username})\n**Reason:** ${reason}`)
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
          )
          .setFooter({ text: `ID: ${id}` }),
      ],
    });

    const sentFrom = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + interaction.guild?.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (config.timeoutDM) {
      const parseString = text =>
        text
          .replaceAll('{reason}', reason)
          .replaceAll('{user}', `${member}`)
          .replaceAll('{moderator}', interaction.user)
          .replaceAll('{duration}', duration)
          .replaceAll('{staff}', interaction.user)
          .replaceAll('{server}', interaction.guild?.name ?? '')
          .replaceAll('{color}', color)
          .replaceAll('{id}', `${id}`)
          .replaceAll('{joined}', `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
          .replaceAll('{created}', `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
          .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

      await member
        .send({
          embeds: [new CustomEmbed(config.timeoutDMMessage, parseString)],
          components: [sentFrom],
          content: parseString(config.timeoutDMMessage.content),
        })
        .catch(() => {});
    }

    if (config.channel) {
      const channel = interaction.guild.channels.cache.get(config.channelId);
      if (!channel) return;

      await channel.send({
        embeds: [
          new Embed(color).setTitle('Member Timed Out').addFields(
            {
              name: 'User',
              value: `${member} (@${member.user.username})`,
              inline: true,
            },
            {
              name: 'Timed Out By',
              value: `${interaction.user}`,
              inline: true,
            },
            {
              name: 'Timed Out In',
              value: `${interaction.channel}`,
              inline: true,
            },
            {
              name: 'User Total Timeouts',
              value: `${userDatabase.timeouts}`,
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
            { name: 'Reason', value: `${reason}`, inline: false },
          ),
        ],
      });
    }
  },
};
