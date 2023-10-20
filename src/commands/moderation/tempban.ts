import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMemberRoleManager,
  type APIEmbedField,
  ChannelType,
} from 'discord.js';
import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import Punishment from '@schemas/Punishment';
import { randomUUID } from 'crypto';
import { CustomEmbed } from '@constants/customEmbed';
import ms from 'ms';
import { tempUnban } from '@functions/unban';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  data: new SlashCommandBuilder()
    .setName('tempban')
    .setDescription('Temporarily ban a user.')
    .addUserOption(option => option.setName('user').setDescription('The user you wish to tempban.').setRequired(true))
    .addStringOption(option =>
      option.setName('duration').setDescription('How long should the user be banned.').setRequired(true),
    )
    .addIntegerOption(option =>
      option
        .setName('delete_messages')
        .setDescription('How many of their recent messages to delete.')
        .setRequired(true)
        .addChoices(
          { name: "Don't delete any", value: 0 },
          { name: 'Previous hour', value: 3600 },
          { name: 'Previous 6 hours', value: 21600 },
          { name: 'Previous 12 hours', value: 43200 },
          { name: 'Previous 24 hours', value: 86400 },
          { name: 'Previous 3 days', value: 259200 },
          { name: 'Previous 7 days', value: 604800 },
        ),
    )
    .addStringOption(option => option.setName('reason').setDescription('The reason for banning the user.'))
    .addBooleanOption(option => option.setName('private').setDescription('Should the message be visible to you only?'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),

  async execute({ client, interaction, color }: CommandArgs) {
    const ephemeral = interaction.options.getBoolean('private') ?? false;

    await interaction.deferReply({ ephemeral });

    const config = await getModerationConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const reason = `${interaction.options.getString('reason') ?? 'No reason specified.'}`.slice(0, 800);
    const duration = interaction.options.getString('duration', true).slice(0, 800);
    const seconds = interaction.options.getInteger('delete_messages', true);
    const user = interaction.options.getUser('user', true);
    const member = interaction.guild?.members.cache.get(user.id)!;

    await getUser(interaction.guildId!, member.id);

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
        embeds: [new Embed(color).setDescription('You cannot ban yourself.')],
      });

    if (!((interaction.member?.roles as any) instanceof GuildMemberRoleManager)) return;

    if (member.roles.highest.rawPosition > (interaction.member!.roles as GuildMemberRoleManager).highest.rawPosition)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot ban a user with roles higher than your own.')],
      });

    const userDatabase = await getUser(interaction.guildId!, member.id);
    if (!userDatabase)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    let ban = true;
    await member.ban({ reason, deleteMessageSeconds: seconds }).catch(async () => {
      ban = false;

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to ban the user.')],
      });
    });

    if (!ban) return;

    userDatabase.tempbans += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: interaction.guildId,
      userId: member.id,

      channelId: interaction.channelId,
      moderatorId: interaction.user.id,
      time: new Date().getTime(),

      type: 'tempban',
      id,
      reason,
      duration,
      active: true,
    });
    await NewPunishment.save();

    setTimeout(async () => {
      await tempUnban(client, NewPunishment);
    }, ms(duration));

    const fields: APIEmbedField[] = [
      {
        name: 'Account Created',
        value: `<t:${user.createdTimestamp / 1000}:R>`,
        inline: true,
      },
    ];

    if (member.joinedTimestamp !== null) {
      fields.splice(0, 0, {
        name: 'Joined Server',
        value: `<t:${member.joinedTimestamp / 1000}:R>`,
        inline: true,
      });
    }

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Temporarily Banned')
          .setDescription(`**User:** ${member} (@${user.username})\n**Reason:** ${reason}`)
          .addFields(fields)
          .setFooter({ text: `ID: ${id}` }),
      ],
    });

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + interaction.guild?.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (config.tempbanDM) {
      const parseString = (text: string) => {
        const res = text
          .replaceAll('{reason}', reason)
          .replaceAll('{user}', `${member}`)
          .replaceAll('{moderator}', interaction.user.toString())
          .replaceAll('{duration}', duration)
          .replaceAll('{staff}', interaction.user.toString())
          .replaceAll('{server}', interaction.guild?.name ?? '')
          .replaceAll('{color}', color.toString())
          .replaceAll('{id}', `${id}`)
          .replaceAll('{icon}', interaction.guild?.iconURL() ?? '')
          .replaceAll('{created}', `<t:${user.createdTimestamp / 1000}:R>`);

        if (member.joinedTimestamp !== null) {
          return text.replaceAll('{joined}', `<t:${member.joinedTimestamp / 1000}:R>`);
        }

        return res;
      };

      await member
        .send({
          embeds: [new CustomEmbed(config.tempbanDMMessage, parseString)],
          components: [sentFrom],
          content: parseString(config.tempbanDMMessage.content),
        })
        .catch(() => {});
    }

    if (config.channel) {
      const channel = interaction.guild?.channels.cache.get(config.channelId);
      if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

      const fields = [
        {
          name: 'User',
          value: `${member} (@${user.username})`,
          inline: true,
        },
        { name: 'Banned By', value: `${interaction.user}`, inline: true },
        {
          name: 'Banned In',
          value: `${interaction.channel}`,
          inline: true,
        },
        {
          name: 'User Total Tempbans',
          value: `${userDatabase.tempbans}`,
          inline: true,
        },
        {
          name: 'Account Created',
          value: `<t:${user.createdTimestamp / 1000}:R>`,
          inline: true,
        },
        { name: 'Reason', value: `${reason}` },
      ];

      if (member.joinedTimestamp !== null) {
        fields.splice(4, 0, {
          name: 'Joined Server',
          value: `<t:${member.joinedTimestamp / 1000}:R>`,
          inline: true,
        });
      }

      await channel.send({
        embeds: [new Embed(color).setTitle('Member Temporarily Banned').addFields(fields)],
      });
    }
  },
};
