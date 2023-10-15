/* eslint-disable no-case-declarations */
const { ReactionManager, User, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getReactionConfig } = require('@configs/reactionConfig');
import { getServerConfig } from '@configs/serverConfig';
import { CustomEmbed } from '@constants/customEmbed';

module.exports = {
  event: 'messageReactionAdd',
  name: 'reactionRoleAdd',
  /**
   *
   * @param {ReactionManager} reaction
   * @param {User} user
   * @param {GuildMember} member
   */
  async execute(reaction, user, client) {
    if (!reaction.message.guildId) return;
    const Reaction = require('@schemas/ReactionRole');
    let reactionRole = await Reaction.findOne({
      guildId: reaction.message.guildId,
      messageId: reaction.message.id,
      emoji: reaction._emoji.name,
    });
    if (!reactionRole)
      reactionRole = await Reaction.findOne({
        guildId: reaction.message.guildId,
        messageId: reaction.message.id,
        emoji: `<:${reaction._emoji.name}:${reaction._emoji.id}>`,
      });

    if (!reactionRole) return;

    const role = reaction.message.guild.roles.cache.get(`${reactionRole.roleId}`);
    const member = reaction.message.guild.members.cache.get(`${user.id}`);
    if (!role) return;
    if (role.managed) return;
    if (role.id === reaction.message.guildId) return;

    if (reactionRole.reqPermission !== 'None' && reactionRole.reqPermission !== 'none') {
      if (!member.permissions.has(reactionRole.reqPermission)) return;
    }

    const config = await getReactionConfig(client, reaction.message.guildId);
    const customConfig = await getServerConfig(client, reaction.message.guildId);
    if (!config || !customConfig) return;
    if (!config.enabled) return;

    let excluded = false;
    reactionRole.excludedRoles.forEach(r => {
      if (reaction.message.member.roles.cache.some(ra => ra.id === r)) excluded = true;
    });
    let required = false;
    reactionRole.reqRoles.forEach(r => {
      if (reaction.message.member.roles.cache.some(ra => ra.id === r)) required = true;
    });
    if (excluded && !required && reactionRole.reqRoles.length === 0) return;

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + reaction.message.guild?.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    async function asyncSwitch(type) {
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
              .replaceAll('{icon}', reaction.message.guild.iconURL())
              .replaceAll('{avatar}', user.avatarURL())
              .replaceAll('{servername}', reaction.message.guild.name)
              .replaceAll('{color}', customConfig.color)
              .replaceAll('{server}', reaction.message.guild.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user)
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
              .replaceAll('{icon}', reaction.message.guild.iconURL())
              .replaceAll('{avatar}', user.avatarURL())
              .replaceAll('{servername}', reaction.message.guild.name)
              .replaceAll('{color}', customConfig.color)
              .replaceAll('{server}', reaction.message.guild.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user)
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
              .replaceAll('{icon}', reaction.message.guild.iconURL())
              .replaceAll('{avatar}', user.avatarURL())
              .replaceAll('{servername}', reaction.message.guild.name)
              .replaceAll('{color}', customConfig.color)
              .replaceAll('{server}', reaction.message.guild.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user)
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
              .replaceAll('{icon}', reaction.message.guild.iconURL())
              .replaceAll('{avatar}', user.avatarURL())
              .replaceAll('{servername}', reaction.message.guild.name)
              .replaceAll('{color}', customConfig.color)
              .replaceAll('{server}', reaction.message.guild.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user)
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
            guildId: reaction.message.guildId,
            messageId: reaction.message.id,
            mode: 'unique',
          });
          if (!reactions) return;

          let hasRole = false;

          reactions.forEach(item => {
            const ra = reaction.message.guild.roles.cache.get(item.roleId);
            const ma = reaction.message.guild.members.cache.get(user.id);
            if (!ra) return;
            if (ma.roles.cache.some(rd => rd.id === `${item.roleId}`)) hasRole = true;
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
                .replaceAll('{icon}', reaction.message.guild.iconURL())
                .replaceAll('{avatar}', user.avatarURL())
                .replaceAll('{servername}', reaction.message.guild.name)
                .replaceAll('{color}', customConfig.color)
                .replaceAll('{server}', reaction.message.guild.name)
                .replaceAll('{role}', role.name)
                .replaceAll('{user}', user)
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
              .replaceAll('{icon}', reaction.message.guild.iconURL())
              .replaceAll('{avatar}', user.avatarURL())
              .replaceAll('{servername}', reaction.message.guild.name)
              .replaceAll('{color}', customConfig.color)
              .replaceAll('{server}', reaction.message.guild.name)
              .replaceAll('{role}', role.name)
              .replaceAll('{user}', user)
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
