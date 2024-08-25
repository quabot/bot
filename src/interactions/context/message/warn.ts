import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import { MessageContextArgs } from '@typings/functionArgs';
import {
  ActionRowBuilder,
  APIEmbedField,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ContextMenuCommandBuilder,
  GuildMemberRoleManager,
  PermissionFlagsBits
} from 'discord.js';
import { randomUUID } from 'crypto';
import Punishment from '@schemas/Punishment';
import { ModerationParser } from '@classes/parsers';
import { CustomEmbed } from '@constants/customEmbed';
import { hasSendPerms } from '@functions/discord';
import { checkModerationRules } from '@functions/moderation-rules';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Warn User Based On Message')
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  async execute({ interaction, color, client }: MessageContextArgs) {
    const message = interaction.targetMessage;
    await interaction.deferReply({ ephemeral: true });

    const config = await getModerationConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    let reason = `Your message: ${message.content.substring(0,500)}` ?? 'No reason provided.';
    if (message.content === '') reason = 'No reason provided.';
    const user = message.author;
    const member = message.member ?? (await interaction.guild?.members.fetch(user.id).catch(() => null));
    if (!member) return await interaction.editReply({ embeds: [new Embed(color).setDescription('User not found.')] });

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
          .setLabel('Sent from server: ' + interaction.guild?.name ?? 'Unknown')
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
      console.log(channel)
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
        embeds: [new Embed(color).setTitle('Member Warned').addFields(fields).setFooter({ text: `ID: ${id}` })],
      });
    }

    await checkModerationRules(client, interaction.guildId!, member.id, 'warn');
  },
};
