import { PermissionFlagsBits } from 'discord.js';
import { getLevelConfig } from '@configs/levelConfig';
import Level from '@schemas/Level';
import { Embed } from '@constants/embed';
import { hasAnyPerms } from '@functions/discord';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'level',
  name: 'reset-old-members',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    return await interaction.editReply('This command has been temporarily disabled.')

    if (!hasAnyPerms(interaction.member, [PermissionFlagsBits.ManageGuild]))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You do not have the required permissions. (Manage Server)')],
      });

    const config = await getLevelConfig(interaction.guildId!, client);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });
    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Levels are disabled in this server.')],
      });

    const users = await Level.find({ guildId: interaction.guildId });
    const removedUsers = users.filter(user => !interaction.guild?.members.cache.has(user.userId));
    removedUsers.forEach(async user => {
      await Level.findOneAndDelete({
        guildId: interaction.guildId,
        userId: user.userId,
      });

      if (removedUsers.indexOf(user) === removedUsers.length - 1) {
        if (interaction.channel) {
          await interaction.editReply({
            embeds: [
              new Embed(color).setDescription(`Reset ${removedUsers.length} users that are no longer in this server.`),
            ],
          });
        }
      }
    });

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Resetting all the users that are no longer in this server. This might take a few minutes to complete. We will let you know when this process is completed.`,
        ),
      ],
    });
    if (removedUsers.length === 0) {
      await interaction.editReply({
        embeds: [new Embed(color).setDescription(`Reset 0 users that are no longer in this server.`)],
      });
    }
  },
};
