import {
  type MessageReaction,
  type User,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type GuildMember,
  type Role,
  PermissionFlagsBits,
} from 'discord.js';
import { getReactionConfig } from '@configs/reactionConfig';
import { getServerConfig } from '@configs/serverConfig';
import { CustomEmbed } from '@constants/customEmbed';
import type { EventArgs } from '@typings/functionArgs';
import Reaction from '@schemas/ReactionRole';
import { permissionBitToString } from '@constants/discord';
import { screamingSnakeToPascalCase } from '@functions/string';
import type { NonNullMongooseReturn, ReactionRoleType } from '@typings/mongoose';
import type { IReactionConfig, IServer } from '@typings/schemas';

module.exports = {
  event: 'messageReactionAdd',
  name: 'reactionRoleAdd',

  async execute({ client, color }: EventArgs, reaction: MessageReaction, user: User) {
    if (!reaction.message.guild?.id) return;
    let reactionRole = await Reaction.findOne({
      guildId: reaction.message.guild!.id,
      messageId: reaction.message.id,
      emoji: reaction.emoji.name,
    });
    if (!reactionRole)
      reactionRole = await Reaction.findOne({
        guildId: reaction.message.guild!.id,
        messageId: reaction.message.id,
        emoji: `<:${reaction.emoji.name}:${reaction.emoji.id}>`,
      });

    if (!reactionRole) return;

    const rawRole = reaction.message.guild!.roles.cache.get(`${reactionRole.roleId}`);
    const rawMember = reaction.message.guild!.members.cache.get(`${user.id}`);

    if (!rawMember || !rawRole) return;
    const member = rawMember as GuildMember;
    const role = rawRole as Role;

    if (role.managed) return;
    if (role.id === reaction.message.guild!.id) return;

    if (reactionRole.reqPermission !== 'None' && reactionRole.reqPermission !== 'none') {
      if (
        !member.permissions.has(
          screamingSnakeToPascalCase(
            permissionBitToString(reactionRole.reqPermission),
          ) as keyof typeof PermissionFlagsBits,
        )
      )
        return;
    }

    const rawConfig = await getReactionConfig(client, reaction.message.guild!.id);
    const rawCustomConfig = await getServerConfig(client, reaction.message.guild!.id);

    if (!rawConfig?.enabled || !rawCustomConfig) return;
    const config = rawConfig as NonNullMongooseReturn<IReactionConfig>;
    const customConfig = rawCustomConfig as NonNullMongooseReturn<IServer>;

    let excluded = false;
    reactionRole.excludedRoles?.forEach(r => {
      if (member.roles.cache.some(ra => ra.id === r)) excluded = true;
    });
    let required = false;
    reactionRole.reqRoles?.forEach(r => {
      if (member.roles.cache.some(ra => ra.id === r)) required = true;
    });
    if (excluded && !required && reactionRole.reqRoles?.length == 0) return;

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + reaction.message.guild?.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    async function asyncSwitch(type: ReactionRoleType) {
      switch (type) {
        // ? Give and remove
        case 'normal':
          await member.roles.add(role);

          const parseNormal = (s: string) =>
            s
              .replaceAll('{action}', 'added')
              .replaceAll('{id}', user.id)
              .replaceAll('{username}', user.username)
              .replaceAll('{discriminator}', user.discriminator)
              .replaceAll('{tag}', user.tag)
              .replaceAll('{icon}', reaction.message.guild!.iconURL() ?? '')
              .replaceAll('{avatar}', user.displayAvatarURL())
              .replaceAll('{servername}', reaction.message.guild!.name)
              .replaceAll('{color}', (customConfig.color ?? color).toString())
              .replaceAll('{server}', reaction.message.guild!.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user.toString())
              .replaceAll('{message}', reaction.message.url);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, parseNormal)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;

        // ? Only give it.
        case 'verify':
          await member.roles.add(role);

          const parseVerify = (s: string) =>
            s
              .replaceAll('{action}', 'added')
              .replaceAll('{id}', user.id)
              .replaceAll('{username}', user.username)
              .replaceAll('{discriminator}', user.discriminator)
              .replaceAll('{tag}', user.tag)
              .replaceAll('{icon}', reaction.message.guild!.iconURL() ?? '')
              .replaceAll('{avatar}', user.displayAvatarURL())
              .replaceAll('{servername}', reaction.message.guild!.name)
              .replaceAll('{color}', (customConfig.color ?? color).toString())
              .replaceAll('{server}', reaction.message.guild!.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user.toString())
              .replaceAll('{message}', reaction.message.url);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, parseVerify)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;

        // ? Only remove it when a reaction is added.
        case 'drop':
          await member.roles.remove(role);

          const parseDrop = (s: string) =>
            s
              .replaceAll('{action}', 'removed')
              .replaceAll('{id}', user.id)
              .replaceAll('{username}', user.username)
              .replaceAll('{discriminator}', user.discriminator)
              .replaceAll('{tag}', user.tag)
              .replaceAll('{icon}', reaction.message.guild!.iconURL() ?? '')
              .replaceAll('{avatar}', user.displayAvatarURL())
              .replaceAll('{servername}', reaction.message.guild!.name)
              .replaceAll('{color}', (customConfig.color ?? color).toString())
              .replaceAll('{server}', reaction.message.guild!.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user.toString())
              .replaceAll('{message}', reaction.message.url);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, parseDrop)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;

        // ? Give and removed, but reversed.
        case 'reversed':
          await member.roles.remove(role);

          const parseReversed = (s: string) =>
            s
              .replaceAll('{action}', 'removed')
              .replaceAll('{id}', user.id)
              .replaceAll('{username}', user.username)
              .replaceAll('{discriminator}', user.discriminator)
              .replaceAll('{tag}', user.tag)
              .replaceAll('{icon}', reaction.message.guild!.iconURL() ?? '')
              .replaceAll('{avatar}', user.displayAvatarURL())
              .replaceAll('{servername}', reaction.message.guild!.name)
              .replaceAll('{color}', (customConfig.color ?? color).toString())
              .replaceAll('{server}', reaction.message.guild!.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user.toString())
              .replaceAll('{message}', reaction.message.url);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, parseReversed)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;

        // ? Unique (only pick one role from the message at a time)
        case 'unique':
          const reactions = await Reaction.find({
            guildId: reaction.message.guild!.id,
            messageId: reaction.message.id,
            mode: 'unique',
          });
          if (!reactions) return;

          let hasRole = false;

          reactions.forEach(item => {
            const ra = reaction.message.guild!.roles.cache.get(item.roleId);
            if (!ra) return;

            if (member.roles.cache.some(rd => rd.id === `${item.roleId}`)) hasRole = true;
          });

          if (hasRole) return;
          if (!hasRole) {
            await member.roles.add(role);

            const parseUnique = (s: string) =>
              s
                .replaceAll('{action}', 'added')
                .replaceAll('{id}', user.id)
                .replaceAll('{username}', user.username)
                .replaceAll('{discriminator}', user.discriminator)
                .replaceAll('{tag}', user.tag)
                .replaceAll('{icon}', reaction.message.guild!.iconURL() ?? '')
                .replaceAll('{avatar}', user.displayAvatarURL())
                .replaceAll('{servername}', reaction.message.guild!.name)
                .replaceAll('{color}', (customConfig.color ?? color).toString())
                .replaceAll('{server}', reaction.message.guild!.name)
                .replaceAll('{role}', role.name)
                .replaceAll('{user}', user.toString())
                .replaceAll('{message}', reaction.message.url);

            if (config.dmEnabled)
              await member
                .send({
                  embeds: [new CustomEmbed(config.dm, parseUnique)],
                  components: [sentFrom],
                })
                .catch(() => {});
          }

          break;

        case 'binding':
          await member.roles.add(role);

          const parseBinding = (s: string) =>
            s
              .replaceAll('{action}', 'added')
              .replaceAll('{id}', user.id)
              .replaceAll('{username}', user.username)
              .replaceAll('{discriminator}', user.discriminator)
              .replaceAll('{tag}', user.tag)
              .replaceAll('{icon}', reaction.message.guild!.iconURL() ?? '')
              .replaceAll('{avatar}', user.displayAvatarURL())
              .replaceAll('{servername}', reaction.message.guild!.name)
              .replaceAll('{color}', (customConfig.color ?? color).toString())
              .replaceAll('{server}', reaction.message.guild!.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user.toString())
              .replaceAll('{message}', reaction.message.url);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, parseBinding)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;
      }
    }

    asyncSwitch(reactionRole.type);
  },
};
