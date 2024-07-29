import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import { PermissionFlagsBits } from 'discord.js';

export default {
  parent: 'role',
  name: 'add',
  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });
    
    const group = interaction.options.getString('group');
    const role = interaction.options.getRole('role');
    if (!role) return await interaction.editReply({ embeds: [new Embed(color).setDescription('Please provide a valid role.')] });

    const fetchedRole = await interaction.guild?.roles.fetch(role.id);
    if (!fetchedRole) return await interaction.editReply({ embeds: [new Embed(color).setDescription('Please provide a valid role.')] });

    //* Check if the role has one of the following perms: Adminstrator, Manage Messages, Manage Channels, Ban Members, Manage Roles, Kick Members, Timeout Members, Manage Webhooks, Manage Emojis, Manage Integrations, Manage Server
    const bannedPermissions = [
      PermissionFlagsBits.Administrator,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.ManageWebhooks,
      PermissionFlagsBits.ManageGuildExpressions,
      PermissionFlagsBits.ManageNicknames,
      PermissionFlagsBits.MoveMembers,
      PermissionFlagsBits.ManageGuild,
      PermissionFlagsBits.ManageThreads,
      PermissionFlagsBits.ViewAuditLog,
      PermissionFlagsBits.ViewGuildInsights,
      PermissionFlagsBits.ViewCreatorMonetizationAnalytics,
    ];
    const hasBannedPermissions = bannedPermissions.some(permission => fetchedRole.permissions.has(permission));
    if (hasBannedPermissions) {
      return await interaction.editReply({ embeds: [new Embed(color).setDescription('You cannot give a role with administrative or moderation permissions to everyone, due to the sensitive nature of these permissions, and the ability to harm the server. These permissions include but are not limited to: Manage Channels, Manage Messages, View Audit Log, Administrator, Manage Server and more.')] });
    }

    let members:any = [];
    switch (group) {
      case 'all': {
        members = interaction.guild?.members.cache.filter(member => !member.user.bot).map(member => member);
        break;
      }

      case 'humans': {
        members = interaction.guild?.members.cache.filter(member => !member.user.bot).map(member => member);
        break;
      }

      case 'bots': {
        members = interaction.guild?.members.cache.filter(member => member.user.bot).map(member => member);
        break;
      }
    }

    if (!members) return await interaction.editReply({ embeds: [new Embed(color).setDescription('No members found.')] });

    const failed = [];
    const success = [];
    for (const member of members) {
      try {
        await member.roles.add(role);
        success.push(member.user.tag);
      } catch {
        failed.push(member.user.tag);
      }
    }

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Role ${role} has been given to ${success.length} members.\nFailed to give the role to ${failed.length} members.`,
        ),
      ]
    });
  },
};
