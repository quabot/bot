import { Client } from '@classes/discord';
import { getReactionConfig } from '@configs/reactionConfig';
import { Embed } from '@constants/embed';
import ReactionRole from '@schemas/ReactionRole';
import type { ButtonArgs } from '@typings/functionArgs';
import { ReactionRoleDropdownType } from '@typings/schemas';
import {
  ActionRowBuilder,
  ComponentType,
  GuildMember,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
export default {
  name: 'reaction-roles-dropdown',
  async execute({ interaction, color }: ButtonArgs, client: Client) {
    const reactionRole = await ReactionRole.findOne({
      guildId: interaction.guildId,
      messageId: interaction.message.id,
    });
    if (!reactionRole)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            'Failed to load the reactionrole. Please ask a server admin to remove this message.',
          ),
        ],
        ephemeral: true,
      });

    const config = await getReactionConfig(client, interaction.guildId ?? '');
    if (!config)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Failed to load the reactionrole configuration. Please try again.')],
        ephemeral: true,
      });
    if (!config.enabled)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Reaction roles are disabled in this server.')],
        ephemeral: true,
      });

    let maxValue =
      (reactionRole.dropdownMax ?? 0) > reactionRole.dropdown.length
        ? reactionRole.dropdown.length
        : reactionRole.dropdownMax ?? reactionRole.dropdown.length;
    if (reactionRole.mode === 'unique') maxValue = 1;

    let minValues = 0;
    if (reactionRole.dropdownMin) minValues = reactionRole.dropdownMin;
    if (minValues > reactionRole.dropdown.length) minValues = reactionRole.dropdown.length;

    const select = new StringSelectMenuBuilder()
      .setCustomId('select-reaction-roles')
      .setMinValues(reactionRole.dropdownMin ?? 0)
      .setMaxValues(maxValue)
      .setPlaceholder(reactionRole.dropdownPlaceholder ?? 'Select a role(s)...');

    const member = interaction.member as GuildMember;
    reactionRole.dropdown.forEach((role: ReactionRoleDropdownType) => {
      const option = new StringSelectMenuOptionBuilder().setLabel(role.label).setValue(role.role);
      if (role.emoji) option.setEmoji(role.emoji);
      if (role.description && role.description.length > 1) option.setDescription(role.description);
      option.setDefault(member.roles.cache.has(role.role));
      select.addOptions(option);
    });

    const msg = await interaction.reply({
      //@ts-ignore
      components: [new ActionRowBuilder().addComponents(select)],
      embeds: [
        new Embed(color)
          .setTitle('Reaction Roles')
          .setDescription('Select a role(s) from the dropdown below to get the role(s).'),
      ],
      ephemeral: true,
      fetchReply: true,
    });

    msg
      .awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 60000 })
      .then(async interaction => {
        const roles = interaction.values;
        if (roles.length === 0)
          return interaction.reply({
            ephemeral: true,
            embeds: [new Embed(color).setDescription('You must select at least one role.')],
          });

        const member = interaction.member as GuildMember;

        if (reactionRole.mode === 'normal' || reactionRole.mode === 'reversed') {
          reactionRole.dropdown.forEach((role: ReactionRoleDropdownType) => {
            if (!roles.includes(role.role)) {
              member.roles.remove(role.role);
            } else {
              member.roles.add(role.role);
            }
          });
        } else if (reactionRole.mode === 'unique') {
          reactionRole.dropdown.forEach((role: ReactionRoleDropdownType) => {
            if (roles.includes(role.role)) {
              member.roles.add(role.role);
            } else {
              member.roles.remove(role.role);
            }
          });
        } else if (reactionRole.mode === 'verify') {
          roles.forEach(role => {
            member.roles.add(role);
          });
        } else if (reactionRole.mode === 'drop') {
          roles.forEach(role => {
            member.roles.remove(role);
          });
        }

        await interaction.reply({ ephemeral: true, embeds: [new Embed(color).setDescription('Roles updated!')] });
      })
      .catch(() => {});
  },
};
