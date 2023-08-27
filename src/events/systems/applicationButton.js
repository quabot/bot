const { Client, Message, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getUser } = require('@configs/user');
const { Embed } = require('@constants/embed');
const { getServerConfig } = require('@configs/serverConfig');
const Application = require('@schemas/Application');

module.exports = {
  event: Events.InteractionCreate,
  name: 'applicationButton',
  /**
   * @param {import('discord.js').Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton() || !interaction.guildId) return;

    const id = interaction.customId;

    if (!id.startsWith('applications-fill-')) return;

    await interaction.deferReply({ ephemeral: true });

    const serverConfig = await getServerConfig(client, interaction.guildId);
    if (!serverConfig)
      return await interaction.editReply({
        embeds: [
          new Embed('#416683').setDescription(
            "We're still setting up some documents for first-time use. Please run the command again.",
          ),
        ],
      });
    const color = serverConfig.color ?? '#416683';

    const appid = id.slice(18, id.length);
    if (!appid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The application form couldn't be found.")],
      });

    const application = await Application.findOne({
      id: appid,
      guildId: interaction.guildId,
    });
    if (!application)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The application form couldn't be found.")],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(`You can apply for **${application.name}** by clicking the button below.`),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Apply')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://quabot.net/dashboard/${interaction.guildId}/user/applications/form/${application.id}`),
        ),
      ],
    });
  },
};
