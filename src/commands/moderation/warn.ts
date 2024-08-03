import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type APIEmbedField,
  GuildMemberRoleManager,
} from 'discord.js';
import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import Punishment from '@schemas/Punishment';
import { randomUUID } from 'crypto';
import { CustomEmbed } from '@constants/customEmbed';
import type { CommandArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { ModerationParser } from '@classes/parsers';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user.')
    .addUserOption(option => option.setName('user').setDescription('The user you wish to warn.').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('The reason for warning the user.').setRequired(true),
    )
    .addBooleanOption(option => option.setName('private').setDescription('Should the message be visible to you only?'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),

  async execute({ client, interaction, color }: CommandArgs) {
    const ephemeral = interaction.options.getBoolean('private') ?? false;

    await interaction.deferReply({ ephemeral });

    const config = await getModerationConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const reason = interaction.options.getString('reason', true).slice(0, 800);
    const user = interaction.options.getUser('user', true);
    const member = interaction.guild?.members.cache.get(user.id)!;

    await getUser(interaction.guildId!, member.id);

    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot warn yourself.')],
      });

    if (!((interaction.member?.roles as any) instanceof GuildMemberRoleManager)) return;

    if (member.roles.highest.rawPosition > (interaction.member!.roles as GuildMemberRoleManager).highest.rawPosition)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot warn a user with roles higher than your own.')],
      });

    const userDatabase = await getUser(interaction.guildId!, member.id);
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

    const fields: APIEmbedField[] = [
      {
        name: 'Account Created',
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
    ];

    if (member.joinedTimestamp !== null) {
      fields.splice(0, 0, {
        name: 'Joined Server',
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true,
      });
    }

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Warned')
          .setDescription(`**User:** ${member} (@${user.username})\n**Reason:** ${reason}`)
          .setFields(fields)
          .setFooter({ text: `ID: ${id}` }),
      ],
    });

    if (config.warnDM && member) {
      const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('sentFrom')
          .setLabel(`Sent from server: ${interaction.guild?.name ?? 'Unknown'}`.substring(0, 80))
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
      );

      const parser = new ModerationParser({ member, reason, interaction, color, id });

      await user
        .send({
          embeds: [new CustomEmbed(config.warnDMMessage, parser)],
          components: [sentFrom],
          content: parser.parse(config.warnDMMessage.content),
        })
        .catch(() => {});
    }

    if (config.channel) {
      const channel = interaction.guild?.channels.cache.get(config.channelId);
      if (!channel?.isTextBased()) return;
      if (!hasSendPerms(channel)) {
        return await interaction.followUp({
          embeds: [
            new Embed(color).setTitle(
              "Didn't send the log message, because I don't have the `SendMessage` permission.",
            ),
          ],
          ephemeral: true,
        });
      }

      const fields = [
        {
          name: 'User',
          value: `${member} (@${user.username})`,
          inline: true,
        },
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

      if (member.joinedTimestamp !== null) {
        fields.splice(4, 0, {
          name: 'Joined Server',
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: true,
        });
      }

      await channel.send({
        embeds: [new Embed(color).setTitle('Member Warned').addFields(fields)],
      });
    }
  },
};
