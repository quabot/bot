import { ChannelType, Events, Role } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildRoleUpdate,
  name: 'roleUpdate',

  async execute({ client }: EventArgs, oldRole: Role, newRole: Role) {
    if (!newRole.guild.id) return;

    const config = await getLoggingConfig(client, newRole.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('roleUpdate')) return;

    const channel = newRole.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;
    if (!hasSendPerms(channel)) return;

    let description = `**Role Edited**\n${newRole}`;
    if (oldRole.mentionable !== newRole.mentionable)
      description += `\n**Mentionable**\n\`${oldRole.mentionable ? 'Yes' : 'No'}\` -> \`${
        newRole.mentionable ? 'Yes' : 'No'
      }\``;
    if (oldRole.name !== newRole.name) description += `\n**Name:**\n\`${oldRole.name}\` -> \`${newRole.name}\``;
    if (oldRole.hoist !== newRole.hoist)
      description += `\n**Seperated in sidebar**\n\`${oldRole.hoist ? 'Yes' : 'No'}\` -> \`${
        newRole.hoist ? 'Yes' : 'No'
      }\``;

    if (oldRole.position !== newRole.position) return;
    if (oldRole.rawPosition !== newRole.rawPosition) return;
    if (oldRole.icon !== newRole.icon) return;
    if (oldRole.managed !== newRole.managed) return;

    const embed = new Embed(newRole.hexColor)
      .setDescription(
        `
                ${description}
                `,
      )
      .setFooter({ text: `@${newRole.name}` });

    const oldPerms = oldRole.permissions.toArray().join('\n');
    const oldPermsLength = String(oldPerms);

    const newPerms = newRole.permissions.toArray().join('\n');
    const newPermsLength = String(newPerms);

    if (oldPermsLength.length < 1024 && newPermsLength.length < 1024 && oldPerms !== newPerms)
      embed.addFields(
        { name: 'Old Permissions', value: `\`${oldPerms}\``, inline: true },
        { name: 'New Permissions', value: `\`${newPerms}\``, inline: true },
      );

    await channel
      .send({
        embeds: [embed],
      })
      .catch(() => {});
  },
};
