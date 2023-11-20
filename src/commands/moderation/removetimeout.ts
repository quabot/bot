import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  GuildMemberRoleManager,
  type APIEmbedField,
  ChannelType,
} from 'discord.js';
import { getModerationConfig } from '@configs/moderationConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  data: new SlashCommandBuilder()
    .setName('removetimeout')
    .setDescription('Remove the timeout from a user.')
    .addUserOption(option =>
      option.setName('user').setDescription('The user you wish to remove the timeout from.').setRequired(true),
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

    const user = interaction.options.getUser('user', true);
    const member = interaction.guild?.members.cache.get(user.id)!;

    await getUser(interaction.guildId!, member.id);

    if (member === interaction.member)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot remove a timeout from yourself.')],
      });

    if (!((interaction.member?.roles as any) instanceof GuildMemberRoleManager)) return;

    if (member.roles.highest.rawPosition > (interaction.member!.roles as GuildMemberRoleManager).highest.rawPosition)
      return interaction.editReply({
        embeds: [
          new Embed(color).setDescription('You cannot remove a timeout from a user with roles higher than your own.'),
        ],
      });

    let timeout = true;
    await member.timeout(1, `Timeout removed by @${interaction.user.username}`).catch(async () => {
      timeout = false;

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to remove the timeout from the user.')],
      });
    });

    if (!timeout) return;

    const fields: APIEmbedField[] = [
      {
        name: 'Account Created',
        value: `t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
    ];

    if (member.joinedTimestamp !== null) {
      fields.splice(0, 0, {
        name: 'Joined Server',
        value: `t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true,
      });
    }

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('User Timeout Removed')
          .setDescription(`**User:** ${member} (@${user.username})`)
          .addFields(fields),
      ],
    });

    if (config.channel) {
      const channel = interaction.guild?.channels.cache.get(config.channelId);
      if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

      const fields = [
        {
          name: 'User',
          value: `${member} (@${user.username})`,
          inline: true,
        },
        { name: 'Removed By', value: `${interaction.user}`, inline: true },
        {
          name: 'Removed In',
          value: `${interaction.channel}`,
          inline: true,
        },
        {
          name: 'Account Created',
          value: `t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
      ];

      if (member.joinedTimestamp !== null) {
        fields.splice(3, 0, {
          name: 'Joined Server',
          value: `t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: true,
        });
      }

      await channel.send({
        embeds: [new Embed(color).setTitle('Member Timeout Removed').setFields(fields)],
      });
    }
  },
};
