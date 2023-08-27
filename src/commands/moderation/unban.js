const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const { getModerationConfig } = require("@configs/moderationConfig");
const { Embed } = require("@constants/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user.")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("The id of the user you wish to unban.")
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("private")
        .setDescription("Should the message be visible to you only?")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction, color) {
    const private = interaction.options.getBoolean("private") ?? false;

    await interaction.deferReply({ ephemeral: private });

    const config = await getModerationConfig(client, interaction.guildId);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up moderation for first-time use! Please run the command again.",
          ),
        ],
      });

    const userId = interaction.options.getString("userid").slice(0, 800);
    if (!userId)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "Please fill out all the required fields.",
          ),
        ],
      });

    if (userId === interaction.user.id)
      return interaction.editReply({
        embeds: [new Embed(color).setDescription("You cannot unban yourself.")],
      });

    let unban = true;
    await interaction.guild.members.unban(userId).catch(async (e) => {
      unban = false;

      await interaction.editReply({
        embeds: [new Embed(color).setDescription("Failed to ban the user.")],
      });
    });

    if (!unban) return;

    interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle("User Unbanned")
          .setDescription(`**User-ID:** ${userId}`),
      ],
    });

    if (config.channel) {
      const channel = interaction.guild.channels.cache.get(config.channelId);
      if (!channel) return;

      await channel.send({
        embeds: [
          new Embed(color)
            .setTitle("Member Unbanned")
            .setDescription(`**User-ID:** ${userId}\n**User:** <@${userId}>.`),
        ],
      });
    }
  },
};
