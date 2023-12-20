import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMemberRoleManager,
  type APIEmbedField,
  ChannelType,
  type User,
} from 'discord.js';
import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import Punishment from '@schemas/Punishment';
import { randomUUID } from 'crypto';
import { CustomEmbed } from '@constants/customEmbed';
import type { CommandArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { isSnowflake } from '@functions/string';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user.')
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
    .addUserOption(option => option.setName('user').setDescription('The user you wish to ban.').setRequired(false))
    .addStringOption(option =>
      option.setName('user-id').setDescription('The id of the user you wish to ban.').setRequired(false),
    )
    .addStringOption(option => option.setName('reason').setDescription('The reason for banning the user.'))
    .addBooleanOption(option => option.setName('private').setDescription('Should the message be visible to you only?'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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

    //* Get the user-defined variables and return errors if they're invalid
    const reason = `${interaction.options.getString('reason') ?? 'No reason specified.'}`.slice(0, 800);
    const deleteMessages = interaction.options.getInteger('delete_messages', true);
    let user = interaction.options.getUser('user');
    const userId = user?.id ?? interaction.options.getString('user-id');

    if (!userId) {
      return await interaction.editReply('You have to fill in the `user` field or the `user-id` field.');
    }

    if (!user) {
      if (!isSnowflake(userId)) {
        return await interaction.editReply(
          "This isn't a valid id, a user id looks something like this `683217001896083456`.\nFor help you could look at [this article](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)",
        );
      }

      user = await client.users.fetch(userId);
    }

    if (!user) {
      return await interaction.editReply(
        "Can't find a user with this id.\nFor help on getting id's, you could look at [this article](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)",
      );
    }

    user = user as NonNullable<User>;

    const member = interaction.guild?.members.cache.get(userId);

    //* Prevent non-allowed bans.
    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot ban yourself.')],
      });

    if (!((interaction.member?.roles as any) instanceof GuildMemberRoleManager)) return;

    if (member) {
      if (member.roles.highest.rawPosition > (interaction.member!.roles as GuildMemberRoleManager).highest.rawPosition)
        return interaction.editReply({
          embeds: [new Embed(color).setDescription('You cannot ban a user with roles higher than your own.')],
        });
    }

    //* Get the user's database and add them if they don't exist.
    const userDatabase = await getUser(interaction.guildId!, userId);

    if (!userDatabase) {
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });
    }

    //* Try to ban the user and return if it fails.
    let ban = true;
    await interaction.guild?.members
      .ban(user ?? userId, { reason, deleteMessageSeconds: deleteMessages })
      .catch(async e => {
        ban = false;

        console.log(e);

        await interaction.editReply({
          embeds: [new Embed(color).setDescription('Failed to ban the user.')],
        });
      });

    if (!ban) return;

    //* Update the databases
    userDatabase.bans += 1;
    await userDatabase.save();

    const id = randomUUID();

    const NewPunishment = new Punishment({
      guildId: interaction.guildId,
      userId,

      channelId: interaction.channelId,
      moderatorId: interaction.user.id,
      time: new Date().getTime(),

      type: 'ban',
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

    if (member?.joinedTimestamp != null) {
      fields.splice(0, 0, {
        name: 'Joined Server',
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true,
      });
    }

    //* Edit the reply to confirm the ban.
    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Banned')
          .setDescription(`**User:** ${member ?? user ?? `<@${userId}>`} (@${user.username})\n**Reason:** ${reason}`)
          .addFields(fields)
          .setFooter({ text: `ID: ${id}` }),
      ],
    });

    //* Send the ban message to the user.
    const sentFrom = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + interaction.guild?.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    if (config.banDM) {
      const parseString = (text: string) => {
        const res = text
          .replaceAll('{reason}', reason)
          .replaceAll('{user}', `${member}`)
          .replaceAll('{moderator}', interaction.user.toString())
          .replaceAll('{staff}', interaction.user.toString())
          .replaceAll('{server}', interaction.guild?.name ?? '')
          .replaceAll('{color}', color.toString())
          .replaceAll('{id}', `${id}`)
          .replaceAll(
            '{created}',
            user?.createdTimestamp ? `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` : 'null',
          )
          .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

        if (member?.joinedTimestamp != null) {
          return text.replaceAll('{joined}', `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`);
        }

        return res;
      };

      await member
        ?.send({
          embeds: [new CustomEmbed(config.banDMMessage, parseString)],
          content: parseString(config.banDMMessage.content),
          components: [sentFrom],
        })
        .catch(() => {});
    }

    //* Send the log message.
    if (config.channel) {
      const channel = interaction.guild?.channels.cache.get(config.channelId);
      if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;
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
        { name: 'Banned By', value: `${interaction.user}`, inline: true },
        {
          name: 'Banned In',
          value: `${interaction.channel}`,
          inline: true,
        },
        {
          name: 'User Total Bans',
          value: `${userDatabase.bans}`,
          inline: true,
        },
        {
          name: 'Account Created',
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        { name: 'Reason', value: `${reason}` },
      ];

      if (member?.joinedTimestamp != null) {
        fields.splice(4, 0, {
          name: 'Joined Server',
          value: `<t:${Math.floor(member?.joinedTimestamp / 1000)}:R>`,
          inline: true,
        });
      }

      await channel.send({
        embeds: [new Embed(color).setTitle('Member Banned').setFields(fields)],
      });
    }
  },
};
