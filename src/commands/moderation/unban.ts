import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getModerationConfig } from '@configs/moderationConfig';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user.')
    .addStringOption(option =>
      option.setName('userid').setDescription('The id of the user you wish to unban.').setRequired(true),
    )
    .addBooleanOption(option => option.setName('private').setDescription('Should the message be visible to you only?'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),

  async execute({ client, interaction, color }: CommandArgs) {
    const ephemeral = interaction.options.getBoolean('private') ?? false;

    await interaction.deferReply({ ephemeral });

    const config = await getModerationConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const userId = interaction.options.getString('userid', true).slice(0, 800);
    if (!userId)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please fill out all the required fields.')],
      });

    if (userId === interaction.user.id)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription('You cannot unban yourself.')],
      });

    let unban = true;

    await interaction.guild!.members.unban(userId).catch(async () => {
      unban = false;

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to unban the user.')],
      });
    });

    if (!unban) return;

    interaction.editReply({
      embeds: [new Embed(color).setTitle('User Unbanned').setDescription(`**User-ID:** ${userId}`)],
    });

    if (config.channel) {
      const channel = interaction.guild?.channels.cache.get(config.channelId);
      if (!channel?.isTextBased()) return;
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

      await channel.send({
        embeds: [
          new Embed(color)
            .setTitle('Member Unbanned')
            .setDescription(`**User-ID:** ${userId}\n**User:** <@${userId}>.`),
        ],
      });
    }
  },
};
