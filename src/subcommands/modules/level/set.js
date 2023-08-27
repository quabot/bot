const { Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const { Embed } = require('@constants/embed');
const { getLevelConfig } = require('@configs/levelConfig');
const { getLevel } = require('@configs/level');

module.exports = {
  parent: 'level',
  name: 'set',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply();

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You do not have the permissions required.')],
      });

    const config = await getLevelConfig(interaction.guildId, client);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use, please try again.",
          ),
        ],
      });
    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Levels are disabled in this server.')],
      });

    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');
    const levelDB = await getLevel(interaction.guildId, user.id);
    if (!levelDB)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use, please try again.",
          ),
        ],
      });

    const xp = interaction.options.getNumber('xp');
    const level = interaction.options.getNumber('level');

    if (config.removeRewards) {
      config.rewards.forEach(async reward => {
        if (reward.level > level) {
          const role = interaction.guild.roles.cache.get(reward.role);
          if (member.roles.cache.has(role.id)) await member.roles.remove(role).catch(() => {});
        }
      });
    }

    if (xp) levelDB.xp = xp;
    if (level) levelDB.level = level;
    await levelDB.save();

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Successfully set ${user}'s level to ${level ?? levelDB.level} and xp to ${
            xp ?? levelDB.xp
          }. Some level rewards might be out of sync.`,
        ),
      ],
    });
  },
};
