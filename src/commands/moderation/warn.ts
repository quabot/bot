import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  type GuildMember,
  type APIEmbedField,
} from 'discord.js';
import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import Punishment from '@schemas/Punishment';
import { randomUUID } from 'crypto';
import { CustomEmbed } from '@constants/customEmbed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user.')
    .addUserOption(option => option.setName('user').setDescription('The user you wish to warn.').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('The reason for warning the user.').setRequired(true),
    )
    .addBooleanOption(option =>
      option.setName('private').setDescription('Should the message be visible to you only?').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),

  async execute({ client, interaction, color }: CommandArgs) {
    const ephemeral = interaction.options.getBoolean('private') ?? false;

    await interaction.deferReply({ ephemeral });

    const config = await getModerationConfig(client, interaction.guildId);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const reason = interaction.options.getString('reason', true).slice(0, 800);
    const member = interaction.options.getMember('user', true);
    const isGuildMember = !('deaf' in member);

    await getUser(interaction.guildId, member.id);

    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot warn yourself.')],
      });

    if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot warn a user with roles higher than your own.')],
      });

    const userDatabase = await getUser(interaction.guildId, member.id);
    if (!userDatabase)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    userDatabase.warns += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: interaction.guildId,
      userId: member.id,

      channelId: interaction.channelId,
      moderatorId: interaction.user.id,
      time: new Date().getTime(),

      type: 'warn',
      id,
      reason,
      duration: 'none',
      active: false,
    });
    await NewPunishment.save();

    const fields: APIEmbedField[] = [];

    if (isGuildMember) {
      const guildMember = member as GuildMember;

      fields.push({
        name: 'Account Created',
        value: `<t:${member.user.createdTimestamp / 1000}:R>`,
        inline: true,
      });

      if (guildMember.joinedTimestamp) {
        fields.splice(0, 0, {
          name: 'Joined Server',
          value: `<t:${member.joinedTimestamp / 1000}:R>`,
          inline: true,
        });
      }
    }

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Warned')
          .setDescription(`**User:** ${member} (@${member.user.username})\n**Reason:** ${reason}`)
          .setFields(fields)
          .setFooter({ text: `ID: ${id}` }),
      ],
    });

    if (config.warnDM) {
      const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('sentFrom')
          .setLabel('Sent from server: ' + interaction.guild?.name ?? 'Unknown')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
      );

      const parseString = (text: string) => {
        let res = text
          .replaceAll('{reason}', reason)
          .replaceAll('{user}', `${member}`)
          .replaceAll('{moderator}', interaction.user.toString())
          .replaceAll('{staff}', interaction.user.toString())
          .replaceAll('{server}', interaction.guild?.name ?? '')
          .replaceAll('{color}', color.toString())
          .replaceAll('{id}', `${id}`)
          .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

        if (isGuildMember) {
          const guildMember = member as GuildMember;
          if (guildMember.joinedTimestamp !== null) {
            return text
              .replaceAll('{joined}', `<t:${guildMember.joinedTimestamp / 1000}:R>`)
              .replaceAll('{created}', `<t:${guildMember.joinedTimestamp / 1000}:R>`);
          }
        }

        return res;
      };

      if (isGuildMember) {
        ((await member) as GuildMember)
          .send({
            embeds: [new CustomEmbed(config.warnDMMessage, parseString)],
            components: [sentFrom],
            content: parseString(config.warnDMMessage.content),
          })
          .catch(() => {});
      }
    }

    if (config.channel) {
      const channel = interaction.guild?.channels.cache.get(config.channelId);
      if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

      const fields = [
        { name: 'Warned By', value: `${interaction.user}`, inline: true },
        {
          name: 'Warned In',
          value: `${interaction.channel}`,
          inline: true,
        },
        {
          name: 'User Total Warns',
          value: `${userDatabase.warns}`,
          inline: true,
        },
        { name: 'Reason', value: `${reason}` },
      ];

      if (isGuildMember) {
        let guildMember = member as GuildMember;
        {
          fields.splice(0, 0, {
            name: 'User',
            value: `${guildMember} (@${guildMember.user.username})`,
            inline: true,
          });

          fields.splice(4, 0, {
            name: 'Joined Server',
            value: `<t:${(guildMember.joinedTimestamp ?? 0) / 1000}:R>`,
            inline: true,
          });

          if ('joinedTimestamp' in guildMember) {
            fields.splice(4, 0, {
              name: 'Joined Server',
              value: `<t:${(guildMember.joinedTimestamp ?? 0) / 1000}:R>`,
              inline: true,
            });
          }
        }
      }

      await channel.send({
        embeds: [new Embed(color).setTitle('Member Warned').addFields(fields)],
      });
    }
  },
};
