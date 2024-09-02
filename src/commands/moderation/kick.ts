import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMemberRoleManager,
  type APIEmbedField,
} from 'discord.js';
import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import Punishment from '@schemas/Punishment';
import { randomUUID } from 'crypto';
import { CustomEmbed } from '@constants/customEmbed';
import type { CommandArgs } from '@typings/functionArgs';
import { hasModerationPerms, hasSendPerms } from '@functions/discord';
import { ModerationParser } from '@classes/parsers';
import { checkModerationRules } from '@functions/moderation-rules';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user.')
    .addUserOption(option => option.setName('user').setDescription('The user you wish to kick.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for kicking the user.'))
    .addBooleanOption(option => option.setName('private').setDescription('Should the message be visible to you only?'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false),

  async execute({ client, interaction, color }: CommandArgs) {
    //* Determine if the command should be ephemeral or not.
    const ephemeral = interaction.options.getBoolean('private') ?? false;

    //* Defer the reply to give the user an instant response.
    await interaction.deferReply({ ephemeral });

    //* Get the moderation config and return if it doesn't exist.
    const config = await getModerationConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    //* Get the reason and member and return if it doesn't exist.
    const reason = `${interaction.options.getString('reason') ?? 'No reason specified.'}`.slice(0, 800);
    const user = interaction.options.getUser('user', true);
    if (!user) return await interaction.editReply({ embeds: [new Embed(color).setDescription('User not found.')] });
    const member =
      interaction.guild?.members.cache.get(user.id)! ||
      (await interaction.guild?.members.fetch(user.id).catch(() => null));
    if (!member)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('User not found, please try again.')],
      });

    await getUser(interaction.guildId!, member.id);

    //* Prevent a non-allowed kick.
    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot kick yourself.')],
      });

    if (!((interaction.member?.roles as any) instanceof GuildMemberRoleManager)) return;

    if (member.roles.highest.rawPosition > (interaction.member!.roles as GuildMemberRoleManager).highest.rawPosition)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot kick a user with roles higher than your own.')],
      });

    if (hasModerationPerms(member))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot kibk a user with moderation permissions.')],
      });

    //* Get the user's database and return if it doesn't exist.
    const userDatabase = await getUser(interaction.guildId!, member.id);
    if (!userDatabase)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    //* Kick the user and return if it fails.
    let kick = true;
    await member.kick(reason).catch(async () => {
      kick = false;

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to kick the user.')],
      });
    });

    if (!kick) return;

    //* Update the database.
    userDatabase.kicks += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: interaction.guildId,
      userId: member.id,

      channelId: interaction.channelId,
      moderatorId: interaction.user.id,
      time: new Date().getTime(),

      type: 'kick',
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

    const revokeButton = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('revoke')
        .setLabel('Remove Punishment')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔓'),
    );
    //* Update the reply to confirm the kick.
    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Kicked')
          .setDescription(`**User:** ${member} (@${user.username})\n**Reason:** ${reason}`)
          .addFields(fields)
          .setFooter({ text: `${id}` }),
      ],
      components: [revokeButton],
    });

    //* Send the DM to the user.
    const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel(`Sent from server: ${interaction.guild?.name ?? 'Unknown'}`.substring(0, 80))
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (config.kickDM && member) {
      const parser = new ModerationParser({ member, reason, interaction, color, id });

      await member
        .send({
          embeds: [new CustomEmbed(config.kickDMMessage, parser)],
          components: [sentFrom],
          content: parser.parse(config.kickDMMessage.content),
        })
        .catch(() => {});
    }

    //* Send the log to the log channel.
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
        { name: 'Kicked By', value: `${interaction.user}`, inline: true },
        {
          name: 'Kicked In',
          value: `${interaction.channel}`,
          inline: true,
        },
        {
          name: 'User Total Kicks',
          value: `${userDatabase.kicks}`,
          inline: true,
        },
        {
          name: 'Account Created',
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
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
        embeds: [
          new Embed(color)
            .setTitle('Member Kicked')
            .setFields(fields)
            .setFooter({ text: `ID: ${id}` }),
        ],
      });
    }

    await checkModerationRules(client, interaction.guildId!, member.id, 'kick');
  },
};
