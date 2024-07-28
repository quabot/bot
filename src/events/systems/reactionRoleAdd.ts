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
import type { NonNullMongooseReturn } from '@typings/mongoose';
import type { IReactionConfig, IServer, ReactionRoleReactionType, ReactionRoleType } from '@typings/schemas';
import { hasRolePerms } from '@functions/discord';
import { ReactionRoleParser } from '@classes/parsers';

export default {
  event: 'messageReactionAdd',
  name: 'reactionRoleAdd',

  async execute({ client }: EventArgs, reaction: MessageReaction, user: User) {
    if (!reaction.message.guild?.id) return;

    const clientMember = reaction.message.guild.members.me;
    if (!clientMember || !clientMember.permissions.has(PermissionFlagsBits.ManageRoles)) return;

    const reactionRole = await Reaction.findOne({
      guildId: reaction.message.guild.id,
      messageId: reaction.message.id,
      channelId: reaction.message.channel.id,
    });
    if (!reactionRole) return;

    const foundReaction: ReactionRoleReactionType = reactionRole.reactions.find(
      (r: ReactionRoleReactionType) => r.emoji === reaction.emoji.toString(),
    );
    if (!foundReaction) return;

    const rawRole = reaction.message.guild.roles.cache.get(`${foundReaction.role}`);
    const rawMember = reaction.message.guild.members.cache.get(`${user.id}`);

    if (!rawMember || !rawRole) return;
    const member = rawMember as GuildMember;
    const role = rawRole as Role;

    //* Return if the highestClientRole position is below or the same as 'role'
    if (!hasRolePerms(role)) return;

    if (role.managed) return;
    if (role.id === reaction.message.guild.id) return;

    const rawConfig = await getReactionConfig(client, reaction.message.guild.id);
    const rawCustomConfig = await getServerConfig(client, reaction.message.guild.id);

    if (!rawConfig?.enabled || !rawCustomConfig) return;
    const config = rawConfig as NonNullMongooseReturn<IReactionConfig>;
    const customConfig = rawCustomConfig as NonNullMongooseReturn<IServer>;

    let excluded = false;
    reactionRole.ignoredRoles?.forEach(r => {
      if (member.roles.cache.some(ra => ra.id === r)) excluded = true;
    });
    let required = false;
    reactionRole.allowedRoles?.forEach(r => {
      if (member.roles.cache.some(ra => ra.id === r)) required = true;
    });
    if (excluded && !required && reactionRole.allowedRoles?.length == 0) return;

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + reaction.message.guild?.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    const parserOptions = { member, color: customConfig.color, role, reaction };
    const addedParser = new ReactionRoleParser({ ...parserOptions, action: 'added' });
    const removedParser = new ReactionRoleParser({ ...parserOptions, action: 'removed' });

    async function asyncSwitch(type: ReactionRoleType) {
      switch (type) {
        // * Give and remove
        case 'normal':
          await member.roles.add(role);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, addedParser)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;

        // * Only give it.
        case 'verify':
          await member.roles.add(role);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, addedParser)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;

        // * Only remove it when a reaction is added.
        case 'drop':
          await member.roles.remove(role);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, removedParser)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;

        // * Give and removed, but reversed.
        case 'reversed':
          await member.roles.remove(role);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, removedParser)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;

        // * Unique (only pick one role from the message at a time)
        case 'unique':
          if (!reactionRole) return;
          const roles = reactionRole.reactions.map((r: ReactionRoleReactionType) => r.role);
          const hasRole = member.roles.cache.some(r => roles.includes(r.id));

          if (hasRole) return;
          if (!hasRole) {
            await member.roles.add(role);

            if (config.dmEnabled)
              await member
                .send({
                  embeds: [new CustomEmbed(config.dm, addedParser)],
                  components: [sentFrom],
                })
                .catch(() => {});
          }

          break;

        case 'binding':
          await member.roles.add(role);

          if (config.dmEnabled)
            await member
              .send({
                embeds: [new CustomEmbed(config.dm, addedParser)],
                components: [sentFrom],
              })
              .catch(() => {});

          break;
      }
    }

    asyncSwitch(reactionRole.mode);
  },
};
