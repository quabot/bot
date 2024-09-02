import { Client } from '@classes/discord';
import { ReactionRoleParser } from '@classes/parsers';
import { getReactionConfig } from '@configs/reactionConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { Embed } from '@constants/embed';
import { hasRolePerms } from '@functions/discord';
import ReactionRole from '@schemas/ReactionRole';
import type { ButtonArgs } from '@typings/functionArgs';
import { ReactionRoleButtonType, ReactionRoleType } from '@typings/schemas';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember } from 'discord.js';
export default {
  name: 'reaction-roles',
  async execute({ interaction, color }: ButtonArgs, client: Client) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getReactionConfig(client, interaction.guildId ?? '');
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('This server does not have a reaction role configuration.')],
      });
    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Reaction roles are disabled in this server.')],
      });

    const reactionRole = await ReactionRole.findOne({
      guildId: interaction.guildId,
      messageId: interaction.message.id,
    });
    if (!reactionRole)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'This message is not a reaction role. Please ask an administrator to remove this message.',
          ),
        ],
      });

    const roleId = interaction.customId.replace('reaction-roles-', '');
    const buttonRole = reactionRole.buttons.find((button: ReactionRoleButtonType) => roleId === button.role);
    if (!buttonRole)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'This button is not linked to a role. Please ask an administrator to remove this button from the message.',
          ),
        ],
      });

    const role = interaction.guild?.roles.cache.get(buttonRole.role);
    if (!role)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "The role associated to this button doesn't exist. Please ask an administrator to remove this button from the message.",
          ),
        ],
      });

    //* Return if the highestClientRole position is below or the same as 'role'
    if (!hasRolePerms(role))
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "I don't have permission to give this role. Please ask an administrator to give me (QuaBot) more permissions.",
          ),
        ],
      });

    if (role.managed)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'This role is for a bot in this server, it cannot be given to users. Please ask an administrator to remove this role from the message.',
          ),
        ],
      });

    if (role.id === interaction.guildId)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'This role is @everyone, it cannot be given to users. Please ask an administrator to remove this role from the message.',
          ),
        ],
      });

    const member = interaction.member as GuildMember;
    if (!member)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "Error: i didn't get the correct data from Discord, please click the button again.",
          ),
        ],
      });

    let excluded = false;
    reactionRole.ignoredRoles?.forEach(r => {
      if (member.roles.cache.some(ra => ra.id === r)) excluded = true;
    });
    let required = false;
    reactionRole.allowedRoles?.forEach(r => {
      if (member.roles.cache.some(ra => ra.id === r)) required = true;
    });
    if (excluded && !required && reactionRole.allowedRoles?.length == 0)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'You are not allowed to get this role. You have either a blocked role, or lack the required role(s).',
          ),
        ],
      });

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + interaction.guild!.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );
    const parserOptions = { member, color, role, reaction: interaction };
    const addedParser = new ReactionRoleParser({ ...parserOptions, action: 'added' });
    const removedParser = new ReactionRoleParser({ ...parserOptions, action: 'removed' });

    async function asyncSwitch(type: ReactionRoleType) {
      if (!role || !config) return await interaction.editReply({ content: 'Role/config not found' });
      switch (type) {
        // * Give and remove
        case 'normal':
          if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            await interaction.editReply({ embeds: [new Embed(color).setDescription(`Removed the role ${role}.`)] });

            if (config.dmEnabled)
              await member
                .send({
                  embeds: [new CustomEmbed(config.dm, removedParser)],
                  components: [sentFrom],
                })
                .catch(() => {});
          } else {
            await interaction.editReply({ embeds: [new Embed(color).setDescription(`Added the role ${role}.`)] });
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

        // * Only give it.
        case 'verify':
          if (member.roles.cache.has(role.id))
            return await interaction.editReply({
              embeds: [new Embed(color).setDescription(`You already have the role ${role}. This role cannot be removed on this message.`)],
            });
          await member.roles.add(role);
          await interaction.editReply({ embeds: [new Embed(color).setDescription(`Added the role ${role}.`)] });

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
          if (!member.roles.cache.has(role.id))
            return await interaction.editReply({
              embeds: [
                new Embed(color).setDescription(
                  `You don't have the role ${role}, you can only remove roles on this message.`,
                ),
              ],
            });
          await member.roles.remove(role);
          await interaction.editReply({ embeds: [new Embed(color).setDescription(`Removed the role ${role}.`)] });

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
          if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            await interaction.editReply({ embeds: [new Embed(color).setDescription(`Removed the role ${role}.`)] });

            if (config.dmEnabled)
              await member
                .send({
                  embeds: [new CustomEmbed(config.dm, removedParser)],
                  components: [sentFrom],
                })
                .catch(() => {});
          } else {
            await interaction.editReply({ embeds: [new Embed(color).setDescription(`Added the role ${role}.`)] });
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

        // * Unique (only pick one role from the message at a time)
        case 'unique':
          if (!reactionRole) return;
          const roles = reactionRole.buttons.map((r: ReactionRoleButtonType) => r.role);
          const hasRole = member.roles.cache.some(r => roles.includes(r.id));

          if (hasRole) return await interaction.editReply({ embeds: [new Embed(color).setDescription(`You can only get one role out of the roles available for this message. You have __not__ been given the role ${role}.`)] });
          if (!hasRole) {
            await member.roles.add(role);
            await interaction.editReply({ embeds: [new Embed(color).setDescription(`Added the role ${role}.`)] });

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
          await interaction.editReply({ embeds: [new Embed(color).setDescription(`Added the role ${role}.`)] });

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
